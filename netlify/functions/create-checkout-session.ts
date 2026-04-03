import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const body = JSON.parse(event.body || '{}')
  const { leadId, email, businessName } = body

  if (!leadId || !email || !businessName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    }
  }

  const origin = event.headers.origin || 'https://profile-optimizer.isyourwebsitegood.com'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: email,
    metadata: {
      leadId,
      businessName,
    },
    success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&lead=${leadId}`,
    cancel_url: `${origin}/get-started`,
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  }
}

export { handler }
