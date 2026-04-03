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

  const result = await execute('SELECT * FROM gbp_deliverables WHERE id = ?', [id])
  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Deliverable not found' }),
    }
  }

  const row = result.rows[0]
  const deliverable = {
    ...row,
    content: row.content ? JSON.parse(row.content as string) : null,
    gbp_data: row.gbp_data ? JSON.parse(row.gbp_data as string) : null,
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ deliverable }),
  }
}

export { handler }
