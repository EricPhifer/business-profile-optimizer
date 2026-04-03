export type BusinessType =
  | 'local_service'
  | 'consultant'
  | 'nonprofit'
  | 'church'
  | 'hoa'
  | 'retail'
  | 'creative'
  | 'technology'
  | 'web_agency'

export type DeliverableStatus = 'draft' | 'published' | 'expired' | 'archived'

export type Track = 'A' | 'B'

export interface GBPLead {
  id: string
  created_at: number
  contact_name: string
  business_name: string
  email: string
  phone: string | null
  website: string | null
  business_type: BusinessType
  city_region: string
  business_description: string | null
  has_gbp: number
  gbp_url: string | null
  status: 'new' | 'paid'
  stripe_session_id: string | null
}

export interface GBPDeliverable {
  id: string
  created_at: number
  updated_at: number
  token: string
  lead_id: string | null
  prospect_id: string | null
  client_id: string | null
  contact_name: string
  business_name: string
  email: string
  business_type: BusinessType
  city_region: string
  track: Track
  gbp_place_id: string | null
  gbp_data: string | null
  content: string | null
  status: DeliverableStatus
  expires_at: number | null
  published_at: number | null
  view_count: number
}

export interface DeliverableContent {
  description: {
    current: string | null
    optimized: string
    characterCount: number
  }
  categories: {
    primary: string
    secondary: string[]
    rationale: string
  }
  services: Array<{
    name: string
    description: string
  }>
  qAndA: Array<{
    question: string
    answer: string
  }>
  photoChecklist: Array<{
    item: string
    why: string
    priority: 'high' | 'medium' | 'low'
  }>
  posts: Array<{
    type: 'intro' | 'event' | 'impact'
    body: string
    cta: string
  }>
  reviewTemplates: {
    positive: string
    mixed: string
  }
  gapAnalysis: GapAnalysisField[] | null
}

export interface GapAnalysisField {
  field: string
  currentValue: string | null
  currentLength?: number
  recommendedValue: string
  recommendedLength?: number
  priority: 'high' | 'medium' | 'low'
  notes: string
}

export interface BusinessData {
  businessName: string
  businessType: BusinessType
  cityRegion: string
  businessDescription: string | null
  website: string | null
  gbpData: GooglePlacesDetail | null
}

export interface GooglePlacesCandidate {
  placeId: string
  name: string
  address: string
  rating: number
  userRatingsTotal: number
  types: string[]
}

export interface GooglePlacesDetail extends GooglePlacesCandidate {
  phone: string | null
  hours: string | null
  photosCount: number
  website: string | null
  reviewsCount: number
  description: string | null
}
