interface AuthResult {
  valid: boolean
  sub?: string
}

export async function verifyAuth0Token(event: { headers: Record<string, string | undefined> }): Promise<AuthResult> {
  const authHeader = event.headers['authorization'] || event.headers['Authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false }
  }

  const token = authHeader.slice(7)
  const domain = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN!

  try {
    // Decode JWT parts
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { valid: false }
    }

    // Decode and validate payload
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false }
    }

    // Check issuer
    const expectedIssuer = `https://${domain}/`
    if (payload.iss && payload.iss !== expectedIssuer) {
      return { valid: false }
    }

    return { valid: true, sub: payload.sub }
  } catch {
    return { valid: false }
  }
}
