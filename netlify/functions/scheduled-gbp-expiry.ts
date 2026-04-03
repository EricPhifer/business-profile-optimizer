import { execute } from './utils/db'

export const handler = async () => {
  const result = await execute(
    `UPDATE gbp_deliverables
     SET status = 'expired'
     WHERE expires_at IS NOT NULL
       AND expires_at < unixepoch()
       AND status = 'published'`
  )

  const rowsUpdated = result.rowsAffected
  console.log(`Expiry cron: ${rowsUpdated} deliverable(s) marked as expired`)

  return {
    statusCode: 200,
    body: JSON.stringify({ expired: rowsUpdated }),
  }
}
