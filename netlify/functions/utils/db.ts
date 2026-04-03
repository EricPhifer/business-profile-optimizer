import { createClient } from '@libsql/client'
import type { InArgs, ResultSet } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

export async function execute(sql: string, args: InArgs = []): Promise<ResultSet> {
  return client.execute({ sql, args })
}

export { client }
