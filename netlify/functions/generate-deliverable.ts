import type { Handler } from '@netlify/functions'
import { verifyAuth0Token } from './utils/auth'
import { execute } from './utils/db'
import { generateToken } from './utils/token'
import { generateContent } from './lib/contentEngine'
import type { BusinessData, GooglePlacesDetail } from './lib/contentEngine'

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const auth = await verifyAuth0Token(event)
  if (!auth.valid) {
    return { statusCode: 401, body: 'Unauthorized' }
  }

  const body = JSON.parse(event.body || '{}')
  const {
    leadId,
    clientId,
    contactName,
    businessName,
    email,
    businessType,
    cityRegion,
    businessDescription,
    website,
    gbpPlaceId,
    gbpData,
  } = body

  if (!contactName || !businessName || !email || !businessType || !cityRegion) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    }
  }

  // Determine track
  const track = gbpPlaceId ? 'B' : 'A'

  // Build business data for content engine
  const businessData: BusinessData = {
    businessName,
    businessType,
    cityRegion,
    businessDescription: businessDescription || null,
    website: website || null,
    gbpData: gbpData || null,
  }

  // Generate content
  const content = generateContent(businessData, gbpData as GooglePlacesDetail | undefined)

  // Generate token and ID
  const token = generateToken()
  const id = crypto.randomUUID()

  // Insert into database
  await execute(
    `INSERT INTO gbp_deliverables (
      id, created_at, updated_at, token, lead_id, client_id,
      contact_name, business_name, email, business_type, city_region,
      track, gbp_place_id, gbp_data, content, status, view_count
    ) VALUES (
      ?, unixepoch(), unixepoch(), ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, 'draft', 0
    )`,
    [
      id,
      token,
      leadId || null,
      clientId || null,
      contactName,
      businessName,
      email,
      businessType,
      cityRegion,
      track,
      gbpPlaceId || null,
      gbpData ? JSON.stringify(gbpData) : null,
      JSON.stringify(content),
    ]
  )

  return {
    statusCode: 200,
    body: JSON.stringify({ id, token }),
  }
}

export { handler }
