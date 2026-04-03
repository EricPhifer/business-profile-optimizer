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

  const id = event.queryStringParameters?.id
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing id parameter' }),
    }
  }

  const result = await execute('SELECT * FROM gbp_leads WHERE id = ?', [id])
  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Lead not found' }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ lead: result.rows[0] }),
  }
}

export { handler }
