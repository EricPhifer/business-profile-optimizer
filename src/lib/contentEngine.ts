// Client-side wrapper around the shared content engine
// The authoritative template logic lives in netlify/functions/lib/contentEngine.ts
// This module re-exports it and adds the AI feature flag check

export {
  generateDescription,
  generateCategories,
  generateServices,
  generateQAndA,
  generatePhotoChecklist,
  generatePosts,
  generateReviewTemplates,
  buildGapAnalysis,
  generateContent,
} from '../../netlify/functions/lib/contentEngine'

export type {
  BusinessData,
  DeliverableContent,
  GapAnalysisField,
  GooglePlacesDetail,
} from '../../netlify/functions/lib/contentEngine'

// Feature flag — default false, flip via env var when AI path is ready
export const USE_AI = import.meta.env.VITE_ENABLE_AI_CONTENT === 'true'
