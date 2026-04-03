import * as crypto from 'crypto'

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function generateToken(): string {
  const bytes = crypto.randomBytes(16)
  let token = ''
  for (let i = 0; i < 16; i++) {
    token += CHARS[bytes[i] % CHARS.length]
  }
  return token
}
