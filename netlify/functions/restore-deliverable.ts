import type { Handler } from '@netlify/functions'
import { verifyAuth0Token } from './utils/auth'
import { execute } from './utils/db'

const NINETY_DAYS_SECONDS = 90 * 24 * 60 * 60

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const auth = await verifyAuth0Token(event)
  if (!auth.valid) {
    return { statusCode: 401, body: 'Unauthorized' }
  }

  const body = JSON.parse(event.body || '{}')
  const { id } = body

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing id' }),
    }
  }

  await execute(
    `UPDATE gbp_deliverables
     SET status = 'published', expires_at = unixepoch() + ?, updated_at = unixepoch()
     WHERE id = ?`,
    [NINETY_DAYS_SECONDS, id]
  )

  // Return new expiry timestamp
  const result = await execute('SELECT expires_at FROM gbp_deliverables WHERE id = ?', [id])
  const expiresAt = result.rows[0]?.expires_at as number

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, expiresAt }),
  }
}

export { handler }
