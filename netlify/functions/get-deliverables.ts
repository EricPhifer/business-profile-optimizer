import type { Handler } from '@netlify/functions'
import { verifyAuth0Token } from './utils/auth'
import { execute } from './utils/db'

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const auth = await verifyAuth0Token(event)
  if (!auth.valid) {
    return { statusCode: 401, body: 'Unauthorized' }
  }

  const status = event.queryStringParameters?.status

  let sql = `SELECT id, business_name, contact_name, email, track, status, expires_at, published_at, view_count, token
    FROM gbp_deliverables`
  const args: string[] = []

  if (status) {
    sql += ' WHERE status = ?'
    args.push(status)
  }

  sql += ' ORDER BY created_at DESC'

  const result = await execute(sql, args)

  return {
    statusCode: 200,
    body: JSON.stringify({ deliverables: result.rows }),
  }
}

export { handler }
