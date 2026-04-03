import { GBP_CONTENT } from './gbpContent'
import type { BusinessType } from './gbpContent'

export interface BusinessData {
  businessName: string
  businessType: BusinessType
  cityRegion: string
  businessDescription: string | null
  website: string | null
  gbpData: GooglePlacesDetail | null
}

export interface GooglePlacesDetail {
  placeId: string
  name: string
  address: string
  phone: string | null
  hours: string[] | null
  rating: number | null
  userRatingsTotal: number | null
  website: string | null
  types: string[]
  description: string | null
  photosCount: number
  reviewsCount: number
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

// ── Utility ──────────────────────────────────────

function interpolate(template: string, data: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '')
}

function buildTokens(data: BusinessData): Record<string, string> {
  let desc = data.businessDescription || ''
  // Trim description to ~200 chars to fit within the 600-720 char budget
  if (desc.length > 200) {
    desc = desc.slice(0, 197).replace(/\s+\S*$/, '') + '...'
  }
  return {
    businessName: data.businessName,
    cityRegion: data.cityRegion,
    businessDescription: desc,
  }
}

// ── Generation functions ─────────────────────────

export function generateDescription(data: BusinessData) {
  const content = GBP_CONTENT[data.businessType]
  const tokens = buildTokens(data)
  const optimized = interpolate(content.descriptionTemplate, tokens)
  return {
    current: data.gbpData?.description ?? null,
    optimized,
    characterCount: optimized.length,
  }
}

export function generateCategories(businessType: BusinessType) {
  return { ...GBP_CONTENT[businessType].categories }
}

export function generateServices(data: BusinessData) {
  const content = GBP_CONTENT[data.businessType]
  const tokens = buildTokens(data)
  return content.services.map((s) => ({
    name: s.name,
    description: interpolate(s.descriptionTemplate, tokens),
  }))
}

export function generateQAndA(data: BusinessData) {
  const content = GBP_CONTENT[data.businessType]
  const tokens = buildTokens(data)
  return content.qAndA.map((qa) => ({
    question: interpolate(qa.question, tokens),
    answer: interpolate(qa.answer, tokens),
  }))
}

export function generatePhotoChecklist(businessType: BusinessType) {
  return GBP_CONTENT[businessType].photoChecklist.map((p) => ({ ...p }))
}

export function generatePosts(data: BusinessData) {
  const content = GBP_CONTENT[data.businessType]
  const tokens = buildTokens(data)
  const types: Array<'intro' | 'event' | 'impact'> = ['intro', 'event', 'impact']
  return types.map((type) => ({
    type,
    body: interpolate(content.postTemplates[type].body, tokens),
    cta: interpolate(content.postTemplates[type].cta, tokens),
  }))
}

export function generateReviewTemplates(data: BusinessData) {
  const content = GBP_CONTENT[data.businessType]
  const tokens = buildTokens(data)
  return {
    positive: interpolate(content.reviewTemplates.positive, tokens),
    mixed: interpolate(content.reviewTemplates.mixed, tokens),
  }
}

export function buildGapAnalysis(
  gbpData: GooglePlacesDetail,
  content: DeliverableContent
): GapAnalysisField[] {
  const fields: GapAnalysisField[] = []

  // Business Description
  fields.push({
    field: 'Business Description',
    currentValue: gbpData.description,
    currentLength: gbpData.description?.length ?? 0,
    recommendedValue: content.description.optimized,
    recommendedLength: content.description.characterCount,
    priority: !gbpData.description ? 'high' : 'medium',
    notes: !gbpData.description
      ? 'No description found. Adding an optimized description is one of the highest-impact changes you can make.'
      : 'Current description exists but may benefit from optimization for keywords, length, and clarity.',
  })

  // Phone Number
  fields.push({
    field: 'Phone Number',
    currentValue: gbpData.phone,
    recommendedValue: gbpData.phone ? 'Present' : 'Add a local phone number',
    priority: !gbpData.phone ? 'high' : 'low',
    notes: !gbpData.phone
      ? 'No phone number listed. A local phone number improves trust and makes it easy for customers to reach you.'
      : 'Phone number is listed. No action needed.',
  })

  // Website
  fields.push({
    field: 'Website',
    currentValue: gbpData.website,
    recommendedValue: gbpData.website ? 'Present' : 'Add your website URL',
    priority: !gbpData.website ? 'high' : 'low',
    notes: !gbpData.website
      ? 'No website linked. Adding your website drives traffic and gives potential customers more information about your business.'
      : 'Website is linked. No action needed.',
  })

  // Hours
  fields.push({
    field: 'Business Hours',
    currentValue: gbpData.hours ? gbpData.hours.join(', ') : null,
    recommendedValue: gbpData.hours ? 'Present' : 'Add your business hours',
    priority: !gbpData.hours ? 'high' : 'low',
    notes: !gbpData.hours
      ? 'No business hours set. Adding hours helps customers know when to visit and improves your profile completeness score.'
      : 'Business hours are set. Keep them updated for holidays and special events.',
  })

  // Photos
  const photoCount = gbpData.photosCount
  let photoPriority: 'high' | 'medium' | 'low' = 'low'
  let photoNotes = ''
  if (photoCount < 5) {
    photoPriority = 'high'
    photoNotes = `Only ${photoCount} photo(s) found. Businesses with 10+ photos get significantly more engagement. Use the photo checklist to add high-impact images.`
  } else if (photoCount < 10) {
    photoPriority = 'medium'
    photoNotes = `${photoCount} photos found. Good start, but aim for 10+ to maximize engagement. Focus on the high-priority items in the photo checklist.`
  } else {
    photoNotes = `${photoCount} photos found. Strong photo count. Continue adding fresh photos periodically to keep your profile active.`
  }
  fields.push({
    field: 'Photos',
    currentValue: `${photoCount} photo(s)`,
    recommendedValue: '10+ photos covering key categories',
    priority: photoPriority,
    notes: photoNotes,
  })

  // Reviews
  const reviewCount = gbpData.reviewsCount
  let reviewPriority: 'high' | 'medium' | 'low' = 'low'
  let reviewNotes = ''
  if (reviewCount < 5) {
    reviewPriority = 'high'
    reviewNotes = `Only ${reviewCount} review(s). Reviews are a critical ranking factor. Use the review response templates to encourage and respond to reviews.`
  } else if (reviewCount < 20) {
    reviewPriority = 'medium'
    reviewNotes = `${reviewCount} reviews. Building momentum — keep encouraging satisfied customers to leave reviews.`
  } else {
    reviewNotes = `${reviewCount} reviews. Strong review count. Focus on responding to every review to maintain engagement.`
  }
  fields.push({
    field: 'Reviews',
    currentValue: `${reviewCount} review(s)`,
    recommendedValue: '20+ reviews with consistent responses',
    priority: reviewPriority,
    notes: reviewNotes,
  })

  // Rating
  if (gbpData.rating !== null) {
    const ratingPriority: 'high' | 'medium' | 'low' = gbpData.rating < 4.0 ? 'high' : gbpData.rating < 4.5 ? 'medium' : 'low'
    fields.push({
      field: 'Rating',
      currentValue: `${gbpData.rating} stars`,
      recommendedValue: '4.5+ star rating',
      priority: ratingPriority,
      notes: gbpData.rating < 4.0
        ? 'Rating is below 4.0. Focus on addressing negative reviews privately and delivering excellent service to improve your average.'
        : gbpData.rating < 4.5
          ? 'Good rating. Continue providing great service and responding thoughtfully to all reviews to push toward 4.5+.'
          : 'Excellent rating. Maintain it by staying responsive to reviews and consistent in service quality.',
    })
  }

  // Sort by priority: high first, then medium, then low
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  fields.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return fields
}

export function generateContent(
  data: BusinessData,
  gbpData?: GooglePlacesDetail
): DeliverableContent {
  const description = generateDescription(data)
  const categories = generateCategories(data.businessType)
  const services = generateServices(data)
  const qAndA = generateQAndA(data)
  const photoChecklist = generatePhotoChecklist(data.businessType)
  const posts = generatePosts(data)
  const reviewTemplates = generateReviewTemplates(data)

  const content: DeliverableContent = {
    description,
    categories,
    services,
    qAndA,
    photoChecklist,
    posts,
    reviewTemplates,
    gapAnalysis: null,
  }

  // Track B: build gap analysis if GBP data is present
  if (gbpData) {
    content.gapAnalysis = buildGapAnalysis(gbpData, content)
  }

  return content
}
