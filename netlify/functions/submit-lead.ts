import type { Handler } from '@netlify/functions'
import { execute } from './utils/db'
import { sendEmail } from './utils/resend'
import * as crypto from 'crypto'

const VALID_BUSINESS_TYPES = [
  'local_service', 'consultant', 'nonprofit', 'church',
  'hoa', 'retail', 'creative', 'technology', 'web_agency',
]

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const body = JSON.parse(event.body || '{}')
  const errors: Record<string, string> = {}

  if (!body.contactName?.trim()) errors.contactName = 'Contact name is required'
  if (!body.businessName?.trim()) errors.businessName = 'Business name is required'
  if (!body.email?.trim()) errors.email = 'Email is required'
  if (!body.businessType || !VALID_BUSINESS_TYPES.includes(body.businessType)) {
    errors.businessType = 'Valid business type is required'
  }
  if (!body.cityRegion?.trim()) errors.cityRegion = 'City / Region is required'

  if (Object.keys(errors).length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ errors }),
    }
  }

  // Sanitize website URL
  let websiteUrl = body.websiteUrl?.trim() || null
  if (websiteUrl && !websiteUrl.match(/^https?:\/\//)) {
    websiteUrl = `https://${websiteUrl}`
  }

  const id = crypto.randomUUID()
  const hasGbp = body.hasGbp ? 1 : 0

  await execute(
    `INSERT INTO gbp_leads (id, created_at, contact_name, business_name, email, phone, website, business_type, city_region, business_description, has_gbp, gbp_url, status)
     VALUES (?, unixepoch(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
    [
      id,
      body.contactName.trim(),
      body.businessName.trim(),
      body.email.trim(),
      body.phone?.trim() || null,
      websiteUrl,
      body.businessType,
      body.cityRegion.trim(),
      body.businessDescription?.trim() || null,
      hasGbp,
      body.gbpUrl?.trim() || null,
    ]
  )

  // Send notification email to Eric
  const notificationEmail = process.env.NOTIFICATION_EMAIL!
  const dashboardLink = `https://profile-optimizer.isyourwebsitegood.com/dashboard?lead=${id}`

  await sendEmail({
    to: notificationEmail,
    subject: `New Profile Optimizer Lead — ${body.businessName.trim()}`,
    html: `
      <h2>New Profile Optimizer Lead</h2>
      <p><strong>Contact:</strong> ${body.contactName.trim()}</p>
      <p><strong>Business:</strong> ${body.businessName.trim()}</p>
      <p><strong>Email:</strong> ${body.email.trim()}</p>
      <p><strong>Phone:</strong> ${body.phone?.trim() || 'Not provided'}</p>
      <p><strong>Website:</strong> ${websiteUrl || 'Not provided'}</p>
      <p><strong>Business Type:</strong> ${body.businessType}</p>
      <p><strong>City/Region:</strong> ${body.cityRegion.trim()}</p>
      <p><strong>Has GBP:</strong> ${hasGbp ? 'Yes' : 'No'}</p>
      ${body.gbpUrl ? `<p><strong>GBP URL:</strong> ${body.gbpUrl.trim()}</p>` : ''}
      ${body.businessDescription ? `<p><strong>Description:</strong> ${body.businessDescription.trim()}</p>` : ''}
      <p><a href="${dashboardLink}">View in Dashboard</a></p>
    `,
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ id }),
  }
}

export { handler }
