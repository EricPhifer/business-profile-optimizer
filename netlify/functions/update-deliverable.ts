import type { Handler } from '@netlify/functions'
import { verifyAuth0Token } from './utils/auth'
import { execute } from './utils/db'

const ALLOWED_FIELDS: Record<string, string> = {
  contactName: 'contact_name',
  businessName: 'business_name',
  email: 'email',
  businessType: 'business_type',
  cityRegion: 'city_region',
  track: 'track',
  gbpPlaceId: 'gbp_place_id',
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const auth = await verifyAuth0Token(event)
  if (!auth.valid) {
    return { statusCode: 401, body: 'Unauthorized' }
  }

  const body = JSON.parse(event.body || '{}')
  const { id, fields } = body

  if (!id || !fields || Object.keys(fields).length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing id or fields' }),
    }
  }

  const setClauses: string[] = ['updated_at = unixepoch()']
  const args: (string | null)[] = []

  for (const [key, value] of Object.entries(fields)) {
    if (key === 'content') {
      setClauses.push('content = ?')
      args.push(JSON.stringify(value))
    } else if (key === 'gbpData') {
      setClauses.push('gbp_data = ?')
      args.push(JSON.stringify(value))
    } else if (ALLOWED_FIELDS[key]) {
      setClauses.push(`${ALLOWED_FIELDS[key]} = ?`)
      args.push(value as string)
    }
  }

  if (setClauses.length === 1) {
    // Only updated_at, no actual fields to update
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No valid fields provided' }),
    }
  }

  args.push(id)
  await execute(
    `UPDATE gbp_deliverables SET ${setClauses.join(', ')} WHERE id = ?`,
    args
  )

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  }
}

export { handler }
