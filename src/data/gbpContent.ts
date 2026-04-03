// Re-export from the shared server-side module
// The authoritative data lives in netlify/functions/lib/gbpContent.ts
// This file re-exports it for client-side usage
export { GBP_CONTENT } from '../../netlify/functions/lib/gbpContent'
export type { GBPTypeContent } from '../../netlify/functions/lib/gbpContent'
