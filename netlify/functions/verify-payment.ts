import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { execute } from './utils/db'
import { sendEmail } from './utils/resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const body = JSON.parse(event.body || '{}')
  const { sessionId, leadId } = body

  if (!sessionId || !leadId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing sessionId or leadId' }),
    }
  }

  // Verify Stripe payment
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Payment not completed' }),
    }
  }

  // Fetch lead
  const leadResult = await execute('SELECT * FROM gbp_leads WHERE id = ?', [leadId])
  if (leadResult.rows.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Lead not found' }),
    }
  }

  const lead = leadResult.rows[0]

  // Update lead status
  await execute(
    'UPDATE gbp_leads SET status = ?, stripe_session_id = ? WHERE id = ?',
    ['paid', sessionId, leadId]
  )

  // Write to prospects table
  const prospectId = crypto.randomUUID()
  await execute(
    `INSERT OR IGNORE INTO prospects (id, created_at, updated_at, business_name, contact_name, email, website_url, source, status)
     VALUES (?, unixepoch(), unixepoch(), ?, ?, ?, ?, 'profile-optimizer', 'optimizer_purchased')`,
    [
      prospectId,
      lead.business_name as string,
      lead.contact_name as string,
      lead.email as string,
      lead.website as string | null,
    ]
  )

  // Send confirmation email to prospect
  await sendEmail({
    to: lead.email as string,
    subject: 'Your Profile Optimizer Report is on the Way',
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Hi ${lead.contact_name},</p>
      <p>Your Google Business Profile Optimizer report for <strong>${lead.business_name}</strong> is being prepared.</p>
      <p>Eric will be in touch with your deliverable link within 1 business day.</p>
      <p>Thank you for choosing Phifer Web Solutions!</p>
    `,
  })

  // Send notification to Eric
  const notificationEmail = process.env.NOTIFICATION_EMAIL!
  const dashboardLink = `https://profile-optimizer.isyourwebsitegood.com/dashboard?lead=${leadId}`

  await sendEmail({
    to: notificationEmail,
    subject: `Profile Optimizer Paid — ${lead.business_name}`,
    html: `
      <h2>Profile Optimizer Payment Confirmed</h2>
      <p><strong>Contact:</strong> ${lead.contact_name}</p>
      <p><strong>Business:</strong> ${lead.business_name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
      <p><strong>Website:</strong> ${lead.website || 'Not provided'}</p>
      <p><strong>Business Type:</strong> ${lead.business_type}</p>
      <p><strong>City/Region:</strong> ${lead.city_region}</p>
      <p><strong>Has GBP:</strong> ${lead.has_gbp ? 'Yes' : 'No'}</p>
      ${lead.gbp_url ? `<p><strong>GBP URL:</strong> ${lead.gbp_url}</p>` : ''}
      <p><strong>Payment:</strong> Confirmed</p>
      <p><a href="${dashboardLink}">View in Dashboard</a></p>
    `,
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, leadId }),
  }
}

export { handler }
