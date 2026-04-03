import type { Handler } from '@netlify/functions'
import { execute } from './utils/db'

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const token = event.queryStringParameters?.token
  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing token parameter' }),
    }
  }

  const result = await execute('SELECT * FROM gbp_deliverables WHERE token = ?', [token])
  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ status: 404, error: 'not_found' }),
    }
  }

  const row = result.rows[0]
  const status = row.status as string

  // Draft, expired, and archived all return expired: true with no content
  if (status === 'draft' || status === 'expired' || status === 'archived') {
    return {
      statusCode: 200,
      body: JSON.stringify({ expired: true }),
    }
  }

  // Published — increment view count and return full content
  await execute(
    'UPDATE gbp_deliverables SET view_count = view_count + 1 WHERE token = ?',
    [token]
  )

  return {
    statusCode: 200,
    body: JSON.stringify({
      expired: false,
      deliverable: {
        id: row.id,
        businessName: row.business_name,
        contactName: row.contact_name,
        businessType: row.business_type,
        cityRegion: row.city_region,
        track: row.track,
        content: row.content ? JSON.parse(row.content as string) : null,
        gbpData: row.gbp_data ? JSON.parse(row.gbp_data as string) : null,
        publishedAt: row.published_at,
        expiresAt: row.expires_at,
      },
    }),
  }
}

export { handler }
