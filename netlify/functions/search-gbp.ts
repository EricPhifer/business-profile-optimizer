import type { Handler } from '@netlify/functions'
import { verifyAuth0Token } from './utils/auth'

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const auth = await verifyAuth0Token(event)
  if (!auth.valid) {
    return { statusCode: 401, body: 'Unauthorized' }
  }

  const params = event.queryStringParameters || {}

  // Mode B — Place Details
  if (params.placeId) {
    const fields = 'name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,website,types,editorial_summary,photos,reviews'
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(params.placeId)}&fields=${fields}&key=${PLACES_API_KEY}`

    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== 'OK' || !data.result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Place not found', status: data.status }),
      }
    }

    const r = data.result
    return {
      statusCode: 200,
      body: JSON.stringify({
        detail: {
          placeId: params.placeId,
          name: r.name || '',
          address: r.formatted_address || '',
          phone: r.formatted_phone_number || null,
          hours: r.opening_hours?.weekday_text || null,
          rating: r.rating ?? null,
          userRatingsTotal: r.user_ratings_total ?? null,
          website: r.website || null,
          types: r.types || [],
          description: r.editorial_summary?.overview || null,
          photosCount: r.photos?.length || 0,
          reviewsCount: r.user_ratings_total || 0,
        },
      }),
    }
  }

  // Mode A — Text Search
  if (params.query && params.location) {
    const searchQuery = `${params.query} ${params.location}`
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${PLACES_API_KEY}`

    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Places API error', status: data.status }),
      }
    }

    const candidates = (data.results || []).slice(0, 5).map((r: Record<string, unknown>) => ({
      placeId: r.place_id,
      name: r.name,
      address: r.formatted_address,
      rating: r.rating ?? 0,
      userRatingsTotal: r.user_ratings_total ?? 0,
      types: r.types || [],
    }))

    return {
      statusCode: 200,
      body: JSON.stringify({ candidates }),
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ error: 'Provide either query+location or placeId' }),
  }
}

export { handler }
