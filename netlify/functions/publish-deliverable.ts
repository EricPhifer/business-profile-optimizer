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
  const { id, isExistingClient } = body

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing id' }),
    }
  }

  if (isExistingClient) {
    // Existing clients get permanent access
    await execute(
      `UPDATE gbp_deliverables
       SET status = 'published', published_at = unixepoch(), expires_at = NULL, updated_at = unixepoch()
       WHERE id = ?`,
      [id]
    )
  } else {
    // Prospects get 90-day access
    await execute(
      `UPDATE gbp_deliverables
       SET status = 'published', published_at = unixepoch(), expires_at = unixepoch() + ?, updated_at = unixepoch()
       WHERE id = ?`,
      [NINETY_DAYS_SECONDS, id]
    )
  }

  // Return the token for URL display
  const result = await execute('SELECT token FROM gbp_deliverables WHERE id = ?', [id])
  const token = result.rows[0]?.token as string

  return {
    statusCode: 200,
    body: JSON.stringify({ token }),
  }
}

export { handler }
