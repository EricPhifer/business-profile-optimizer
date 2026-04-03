<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import TrackBadge from '../../components/ui/TrackBadge.vue'
import CopyButton from '../../components/ui/CopyButton.vue'
import CharCounter from '../../components/ui/CharCounter.vue'
import { generateContent } from '../../lib/contentEngine'
import type { BusinessType, DeliverableStatus, Track, DeliverableContent, GooglePlacesCandidate, GooglePlacesDetail } from '../../types'

const router = useRouter()
const route = useRoute()
const { idTokenClaims } = useAuth0()

// ── State ────────────────────────────────────────
const businessInfo = reactive({
  contactName: '',
  businessName: '',
  email: '',
  businessType: '' as BusinessType | '',
  cityRegion: '',
})
const track = ref<Track>('A')
const gbpData = ref<GooglePlacesDetail | null>(null)
const gbpPlaceId = ref<string | null>(null)
const content = ref<DeliverableContent | null>(null)
const deliverableId = ref<string | null>(null)
const deliverableToken = ref<string | null>(null)
const status = ref<DeliverableStatus>('draft')
const isExistingClient = ref(false)
const isSaving = ref(false)
const isGenerating = ref(false)
const isPublishing = ref(false)
const isDirty = ref(false)
const loadError = ref('')

// GBP search state
const gbpSearchQuery = ref('')
const gbpSearchLocation = ref('')
const gbpCandidates = ref<GooglePlacesCandidate[]>([])
const gbpSearching = ref(false)
const gbpLoadingDetail = ref(false)
const showGbpSearch = ref(true)

const businessTypes: { value: BusinessType; label: string }[] = [
  { value: 'local_service', label: 'Local Service' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'church', label: 'Church' },
  { value: 'hoa', label: 'HOA' },
  { value: 'retail', label: 'Retail' },
  { value: 'creative', label: 'Creative' },
  { value: 'technology', label: 'Technology' },
  { value: 'web_agency', label: 'Web Design / Agency' },
]

const isNew = computed(() => route.params.id === 'new')
const publicUrl = computed(() => deliverableToken.value ? `${window.location.origin}/${deliverableToken.value}` : '')

// Category tag input
const categoryInput = ref('')

// ── Auth helper ──────────────────────────────────
async function authFetch(url: string, opts: RequestInit = {}) {
  const token = idTokenClaims.value?.__raw
  const headers: Record<string, string> = { ...opts.headers as Record<string, string>, Authorization: `Bearer ${token}` }
  if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
  return fetch(url, { ...opts, headers })
}

// ── Dirty tracking ───────────────────────────────
function markDirty() { isDirty.value = true }

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (isDirty.value) { e.preventDefault() }
}

onMounted(() => { window.addEventListener('beforeunload', handleBeforeUnload) })
onBeforeUnmount(() => { window.removeEventListener('beforeunload', handleBeforeUnload) })

onBeforeRouteLeave(() => {
  if (isDirty.value) {
    return window.confirm('You have unsaved changes. Leave anyway?')
  }
  return true
})

// ── Load data on mount ───────────────────────────
onMounted(async () => {
  if (isNew.value) {
    const leadId = route.query.lead as string
    if (leadId) {
      try {
        const res = await authFetch(`/.netlify/functions/get-lead?id=${leadId}`)
        if (res.ok) {
          const { lead } = await res.json()
          businessInfo.contactName = lead.contact_name || ''
          businessInfo.businessName = lead.business_name || ''
          businessInfo.email = lead.email || ''
          businessInfo.businessType = lead.business_type || ''
          businessInfo.cityRegion = lead.city_region || ''
          if (lead.has_gbp && lead.gbp_url) {
            track.value = 'B'
          }
          gbpSearchQuery.value = lead.business_name || ''
          gbpSearchLocation.value = lead.city_region || ''
        }
      } catch {
        loadError.value = 'Failed to load lead data.'
      }
    }
  } else {
    // Load existing deliverable
    try {
      const res = await authFetch(`/.netlify/functions/get-deliverable?id=${route.params.id}`)
      if (!res.ok) throw new Error()
      const { deliverable } = await res.json()
      businessInfo.contactName = deliverable.contact_name
      businessInfo.businessName = deliverable.business_name
      businessInfo.email = deliverable.email
      businessInfo.businessType = deliverable.business_type
      businessInfo.cityRegion = deliverable.city_region
      track.value = deliverable.track
      gbpPlaceId.value = deliverable.gbp_place_id
      gbpData.value = deliverable.gbp_data
      content.value = deliverable.content
      deliverableId.value = deliverable.id
      deliverableToken.value = deliverable.token
      status.value = deliverable.status
      isExistingClient.value = deliverable.expires_at === null && deliverable.status === 'published'

      gbpSearchQuery.value = deliverable.business_name
      gbpSearchLocation.value = deliverable.city_region
      if (gbpData.value) showGbpSearch.value = false
    } catch {
      loadError.value = 'Failed to load deliverable.'
    }
  }
})

// ── GBP Search ───────────────────────────────────
async function searchGbp() {
  if (!gbpSearchQuery.value || !gbpSearchLocation.value) return
  gbpSearching.value = true
  gbpCandidates.value = []
  try {
    const res = await authFetch(
      `/.netlify/functions/search-gbp?query=${encodeURIComponent(gbpSearchQuery.value)}&location=${encodeURIComponent(gbpSearchLocation.value)}`
    )
    if (res.ok) {
      const data = await res.json()
      gbpCandidates.value = data.candidates || []
    }
  } finally {
    gbpSearching.value = false
  }
}

async function selectCandidate(candidate: GooglePlacesCandidate) {
  gbpLoadingDetail.value = true
  try {
    const res = await authFetch(`/.netlify/functions/search-gbp?placeId=${encodeURIComponent(candidate.placeId)}`)
    if (res.ok) {
      const data = await res.json()
      gbpData.value = data.detail
      gbpPlaceId.value = candidate.placeId
      track.value = 'B'
      showGbpSearch.value = false
      gbpCandidates.value = []
      markDirty()
    }
  } finally {
    gbpLoadingDetail.value = false
  }
}

function clearGbp() {
  gbpData.value = null
  gbpPlaceId.value = null
  track.value = 'A'
  showGbpSearch.value = true
  markDirty()
}

// ── Content Generation ───────────────────────────
async function handleGenerate() {
  if (!businessInfo.businessType) return
  if (content.value && !window.confirm('This will overwrite your current content. Continue?')) return

  isGenerating.value = true
  try {
    if (!deliverableId.value) {
      // New: call generate-deliverable to create DB record
      const res = await authFetch('/.netlify/functions/generate-deliverable', {
        method: 'POST',
        body: JSON.stringify({
          contactName: businessInfo.contactName,
          businessName: businessInfo.businessName,
          email: businessInfo.email,
          businessType: businessInfo.businessType,
          cityRegion: businessInfo.cityRegion,
          gbpPlaceId: gbpPlaceId.value,
          gbpData: gbpData.value,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      deliverableId.value = data.id
      deliverableToken.value = data.token

      // Load the full deliverable to get the generated content
      const delRes = await authFetch(`/.netlify/functions/get-deliverable?id=${data.id}`)
      if (delRes.ok) {
        const { deliverable } = await delRes.json()
        content.value = deliverable.content
        status.value = deliverable.status
      }
    } else {
      // Existing: regenerate locally and update
      const gbpDetail = gbpData.value as import('../../lib/contentEngine').GooglePlacesDetail | undefined
      const businessData: import('../../lib/contentEngine').BusinessData = {
        businessName: businessInfo.businessName,
        businessType: businessInfo.businessType as BusinessType,
        cityRegion: businessInfo.cityRegion,
        businessDescription: null,
        website: null,
        gbpData: gbpDetail ?? null,
      }
      const newContent = generateContent(businessData, gbpDetail)
      content.value = newContent

      await authFetch('/.netlify/functions/update-deliverable', {
        method: 'PUT',
        body: JSON.stringify({ id: deliverableId.value, fields: { content: newContent } }),
      })
    }
    isDirty.value = false
  } finally {
    isGenerating.value = false
  }
}

// ── Save Draft ───────────────────────────────────
async function saveDraft() {
  if (!businessInfo.businessType) return
  isSaving.value = true
  try {
    if (!deliverableId.value) {
      // Need to create first
      await handleGenerate()
    } else {
      const fields: Record<string, unknown> = {
        contactName: businessInfo.contactName,
        businessName: businessInfo.businessName,
        email: businessInfo.email,
        businessType: businessInfo.businessType,
        cityRegion: businessInfo.cityRegion,
        track: track.value,
      }
      if (content.value) fields.content = content.value
      if (gbpData.value) fields.gbpData = gbpData.value
      if (gbpPlaceId.value) fields.gbpPlaceId = gbpPlaceId.value

      await authFetch('/.netlify/functions/update-deliverable', {
        method: 'PUT',
        body: JSON.stringify({ id: deliverableId.value, fields }),
      })
    }
    isDirty.value = false
  } finally {
    isSaving.value = false
  }
}

// ── Publish / Restore ────────────────────────────
async function publish() {
  if (!deliverableId.value) return
  isPublishing.value = true
  try {
    const res = await authFetch('/.netlify/functions/publish-deliverable', {
      method: 'POST',
      body: JSON.stringify({ id: deliverableId.value, isExistingClient: isExistingClient.value }),
    })
    if (res.ok) {
      const data = await res.json()
      deliverableToken.value = data.token
      status.value = 'published'
      isDirty.value = false
    }
  } finally {
    isPublishing.value = false
  }
}

async function restoreDeliverable() {
  if (!deliverableId.value) return
  isPublishing.value = true
  try {
    const res = await authFetch('/.netlify/functions/restore-deliverable', {
      method: 'POST',
      body: JSON.stringify({ id: deliverableId.value }),
    })
    if (res.ok) {
      status.value = 'published'
    }
  } finally {
    isPublishing.value = false
  }
}

// ── Content section helpers ──────────────────────
function addService() {
  content.value?.services.push({ name: '', description: '' })
  markDirty()
}
function removeService(i: number) {
  content.value?.services.splice(i, 1)
  markDirty()
}
function addQA() {
  content.value?.qAndA.push({ question: '', answer: '' })
  markDirty()
}
function removeQA(i: number) {
  content.value?.qAndA.splice(i, 1)
  markDirty()
}
function addPhotoItem() {
  content.value?.photoChecklist.push({ item: '', why: '', priority: 'medium' })
  markDirty()
}
function removePhotoItem(i: number) {
  content.value?.photoChecklist.splice(i, 1)
  markDirty()
}
function addCategory(e: KeyboardEvent) {
  if (e.key === 'Enter' && categoryInput.value.trim() && content.value) {
    e.preventDefault()
    if (content.value.categories.secondary.length < 9) {
      content.value.categories.secondary.push(categoryInput.value.trim())
      categoryInput.value = ''
      markDirty()
    }
  }
}
function removeCategory(i: number) {
  content.value?.categories.secondary.splice(i, 1)
  markDirty()
}

// Photo checklist grouped display
const groupedPhotos = computed(() => {
  if (!content.value) return { high: [], medium: [], low: [] }
  const high = content.value.photoChecklist.filter((p) => p.priority === 'high')
  const medium = content.value.photoChecklist.filter((p) => p.priority === 'medium')
  const low = content.value.photoChecklist.filter((p) => p.priority === 'low')
  return { high, medium, low }
})

// Get index in the original array for a grouped item
function photoIndex(item: { item: string; why: string; priority: string }): number {
  return content.value?.photoChecklist.findIndex((p) => p === item) ?? -1
}
</script>

<template>
  <div class="min-h-screen bg-bg pb-24">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Top bar -->
      <div class="flex items-center gap-4 mb-6">
        <button
          class="text-text-secondary hover:text-primary transition-colors"
          @click="router.push('/dashboard')"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-extrabold text-primary">
          {{ isNew ? 'New Deliverable' : 'Edit Deliverable' }}
        </h1>
        <StatusBadge v-if="deliverableId" :status="status" />
        <TrackBadge :track="track" />
      </div>

      <div v-if="loadError" class="text-red-500 mb-4">{{ loadError }}</div>

      <!-- ── Business Info Card ──────────────────── -->
      <div class="bg-surface rounded-lg p-6 mb-4">
        <h2 class="text-lg font-bold text-text mb-4">Business Info</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-text-secondary mb-1">Contact Name</label>
            <input v-model="businessInfo.contactName" type="text" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
          </div>
          <div>
            <label class="block text-xs font-medium text-text-secondary mb-1">Business Name</label>
            <input v-model="businessInfo.businessName" type="text" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
          </div>
          <div>
            <label class="block text-xs font-medium text-text-secondary mb-1">Email</label>
            <input v-model="businessInfo.email" type="email" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
          </div>
          <div>
            <label class="block text-xs font-medium text-text-secondary mb-1">Business Type</label>
            <select v-model="businessInfo.businessType" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @change="markDirty">
              <option value="" disabled>Select type</option>
              <option v-for="bt in businessTypes" :key="bt.value" :value="bt.value">{{ bt.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-secondary mb-1">City / Region</label>
            <input v-model="businessInfo.cityRegion" type="text" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
          </div>
          <div class="flex items-end gap-4">
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1">Track</label>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="px-3 py-2 text-xs font-medium rounded-md transition-colors"
                  :class="track === 'A' ? 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' : 'bg-bg border border-text-secondary/20 text-text-secondary'"
                  @click="track = 'A'; markDirty()"
                >A: No GBP</button>
                <button
                  type="button"
                  class="px-3 py-2 text-xs font-medium rounded-md transition-colors"
                  :class="track === 'B' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : 'bg-bg border border-text-secondary/20 text-text-secondary'"
                  @click="track = 'B'; markDirty()"
                >B: Has GBP</button>
              </div>
            </div>
            <label class="flex items-center gap-2 text-xs text-text-secondary cursor-pointer pb-2">
              <input v-model="isExistingClient" type="checkbox" class="rounded" @change="markDirty" />
              Existing Client?
            </label>
          </div>
        </div>
      </div>

      <!-- ── GBP Lookup Card ─────────────────────── -->
      <div class="bg-surface rounded-lg p-6 mb-4">
        <h2 class="text-lg font-bold text-text mb-4">GBP Lookup</h2>

        <!-- Summary row when gbpData selected -->
        <div v-if="gbpData && !showGbpSearch" class="flex items-center justify-between bg-bg rounded-md p-3 border border-text-secondary/10">
          <div class="text-sm text-text">
            <span class="font-medium">Using:</span>
            {{ gbpData.name }}
            <span class="text-text-secondary mx-1">&middot;</span>
            {{ gbpData.rating }}<span class="text-amber-500">&#9733;</span>
            <span class="text-text-secondary mx-1">&middot;</span>
            {{ gbpData.reviewsCount }} reviews
            <span class="text-text-secondary mx-1">&middot;</span>
            {{ gbpData.photosCount }} photos
          </div>
          <button class="text-xs text-primary font-medium hover:underline" @click="showGbpSearch = true">Change</button>
        </div>

        <!-- Search UI -->
        <div v-if="showGbpSearch">
          <div class="flex gap-2 mb-3">
            <input
              v-model="gbpSearchQuery"
              type="text"
              placeholder="Business name"
              class="flex-1 rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              v-model="gbpSearchLocation"
              type="text"
              placeholder="City / Region"
              class="flex-1 rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              :disabled="gbpSearching || !gbpSearchQuery || !gbpSearchLocation"
              @click="searchGbp"
            >
              {{ gbpSearching ? 'Searching...' : 'Search GBP' }}
            </button>
          </div>

          <!-- Candidates -->
          <div v-if="gbpCandidates.length > 0" class="space-y-2 mb-3">
            <div
              v-for="c in gbpCandidates"
              :key="c.placeId"
              class="flex items-center justify-between bg-bg rounded-md p-3 border border-text-secondary/10"
            >
              <div>
                <div class="text-sm font-medium text-text">{{ c.name }}</div>
                <div class="text-xs text-text-secondary">{{ c.address }}</div>
                <div class="text-xs text-text-secondary mt-0.5">
                  {{ c.rating }}<span class="text-amber-500">&#9733;</span>
                  ({{ c.userRatingsTotal }} reviews)
                </div>
              </div>
              <button
                class="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                :disabled="gbpLoadingDetail"
                @click="selectCandidate(c)"
              >
                Use This Profile
              </button>
            </div>
          </div>

          <button
            v-if="gbpCandidates.length > 0 || gbpData"
            class="text-xs text-text-secondary hover:text-text transition-colors"
            @click="clearGbp"
          >
            No GBP / Skip &rarr; Track A
          </button>
        </div>
      </div>

      <!-- ── Generate Button ──────────────────────── -->
      <div class="mb-4">
        <button
          class="w-full py-3 bg-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          :disabled="isGenerating || !businessInfo.businessType"
          @click="handleGenerate"
        >
          {{ isGenerating ? 'Generating...' : content ? 'Regenerate Content' : 'Generate Content' }}
        </button>
      </div>

      <!-- ── Content Sections ─────────────────────── -->
      <template v-if="content">

        <!-- Business Description -->
        <div class="bg-surface rounded-lg p-6 mb-4">
          <h2 class="text-lg font-bold text-text mb-4">Business Description</h2>

          <div v-if="track === 'B' && content.description.current" class="mb-4">
            <label class="block text-xs font-medium text-text-secondary mb-1">Current GBP Description</label>
            <div class="bg-bg rounded-md p-3 border border-text-secondary/10 text-sm text-text-secondary whitespace-pre-wrap">{{ content.description.current }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ content.description.current.length }} characters</div>
          </div>

          <label class="block text-xs font-medium text-text-secondary mb-1">Optimized Description</label>
          <textarea
            v-model="content.description.optimized"
            rows="5"
            class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            @input="content!.description.characterCount = content!.description.optimized.length; markDirty()"
          />
          <CharCounter :current="content.description.optimized.length" :max="750" :target-min="600" :target-max="720" />
        </div>

        <!-- Categories -->
        <div class="bg-surface rounded-lg p-6 mb-4">
          <h2 class="text-lg font-bold text-text mb-4">Categories</h2>
          <div class="mb-3">
            <label class="block text-xs font-medium text-text-secondary mb-1">Primary Category</label>
            <input v-model="content.categories.primary" type="text" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
          </div>
          <div class="mb-3">
            <label class="block text-xs font-medium text-text-secondary mb-1">Secondary Categories (max 9)</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(cat, i) in content.categories.secondary"
                :key="i"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg text-xs font-medium text-text border border-text-secondary/10"
              >
                {{ cat }}
                <button type="button" class="text-text-secondary hover:text-red-500 ml-0.5" @click="removeCategory(i)">&times;</button>
              </span>
            </div>
            <input
              v-model="categoryInput"
              type="text"
              placeholder="Type + Enter to add"
              class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              :disabled="content.categories.secondary.length >= 9"
              @keydown="addCategory"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-text-secondary mb-1">Rationale</label>
            <textarea v-model="content.categories.rationale" rows="2" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y" @input="markDirty" />
          </div>
        </div>

        <!-- Services -->
        <div class="bg-surface rounded-lg p-6 mb-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-text">Services</h2>
            <button class="text-xs font-medium text-primary hover:underline" @click="addService">+ Add Service</button>
          </div>
          <div v-for="(svc, i) in content.services" :key="i" class="flex gap-2 mb-3 items-start">
            <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
              <input v-model="svc.name" type="text" placeholder="Service name" class="rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
              <textarea v-model="svc.description" placeholder="Description" rows="2" class="md:col-span-2 rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y" @input="markDirty" />
            </div>
            <button class="mt-2 text-text-secondary hover:text-red-500 text-lg leading-none" @click="removeService(i)">&times;</button>
          </div>
        </div>

        <!-- Q&A Bank -->
        <div class="bg-surface rounded-lg p-6 mb-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-text">Q&amp;A Bank</h2>
            <button class="text-xs font-medium text-primary hover:underline" @click="addQA">+ Add Q&amp;A</button>
          </div>
          <div v-for="(qa, i) in content.qAndA" :key="i" class="flex gap-2 mb-3 items-start">
            <div class="flex-1 space-y-2">
              <input v-model="qa.question" type="text" placeholder="Question" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
              <textarea v-model="qa.answer" placeholder="Answer" rows="2" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y" @input="markDirty" />
            </div>
            <button class="mt-2 text-text-secondary hover:text-red-500 text-lg leading-none" @click="removeQA(i)">&times;</button>
          </div>
        </div>

        <!-- Photo Checklist -->
        <div class="bg-surface rounded-lg p-6 mb-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-text">Photo Checklist</h2>
            <button class="text-xs font-medium text-primary hover:underline" @click="addPhotoItem">+ Add Item</button>
          </div>
          <template v-for="(group, priority) in groupedPhotos" :key="priority">
            <div v-if="group.length > 0" class="mb-3">
              <div class="text-xs font-semibold uppercase tracking-wide mb-2"
                :class="priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-amber-500' : 'text-gray-400'"
              >{{ priority }} priority</div>
              <div v-for="photo in group" :key="photoIndex(photo)" class="flex gap-2 mb-2 items-start">
                <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                  <input v-model="photo.item" type="text" placeholder="Item" class="md:col-span-4 rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
                  <input v-model="photo.why" type="text" placeholder="Why" class="md:col-span-6 rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
                  <select v-model="photo.priority" class="md:col-span-2 rounded-md border border-text-secondary/20 bg-bg px-2 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @change="markDirty">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <button class="mt-2 text-text-secondary hover:text-red-500 text-lg leading-none" @click="removePhotoItem(photoIndex(photo))">&times;</button>
              </div>
            </div>
          </template>
        </div>

        <!-- Posts -->
        <div class="bg-surface rounded-lg p-6 mb-4">
          <h2 class="text-lg font-bold text-text mb-4">Posts</h2>
          <div class="space-y-4">
            <div v-for="post in content.posts" :key="post.type" class="bg-bg rounded-md p-4 border border-text-secondary/10">
              <div class="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{{ post.type }}</div>
              <label class="block text-xs font-medium text-text-secondary mb-1">Body</label>
              <textarea v-model="post.body" rows="4" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y mb-1" @input="markDirty" />
              <CharCounter :current="post.body.length" :max="1500" :target-min="200" :target-max="1400" />
              <label class="block text-xs font-medium text-text-secondary mt-3 mb-1">Call to Action</label>
              <input v-model="post.cta" type="text" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" @input="markDirty" />
            </div>
          </div>
        </div>

        <!-- Review Templates -->
        <div class="bg-surface rounded-lg p-6 mb-4">
          <h2 class="text-lg font-bold text-text mb-4">Review Templates</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1">Positive Review Response</label>
              <textarea v-model="content.reviewTemplates.positive" rows="4" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y" @input="markDirty" />
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1">Mixed/Negative Review Response</label>
              <textarea v-model="content.reviewTemplates.mixed" rows="4" class="w-full rounded-md border border-text-secondary/20 bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y" @input="markDirty" />
            </div>
          </div>
        </div>

        <!-- Gap Analysis (Track B only) -->
        <div v-if="track === 'B' && content.gapAnalysis && content.gapAnalysis.length > 0" class="bg-surface rounded-lg p-6 mb-4">
          <h2 class="text-lg font-bold text-text mb-4">Gap Analysis</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-text-secondary/10 text-left">
                  <th class="py-2 px-2 font-semibold text-text">Field</th>
                  <th class="py-2 px-2 font-semibold text-text">Current</th>
                  <th class="py-2 px-2 font-semibold text-text">Recommended</th>
                  <th class="py-2 px-2 font-semibold text-text">Priority</th>
                  <th class="py-2 px-2 font-semibold text-text">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(gap, i) in content.gapAnalysis" :key="i" class="border-b border-text-secondary/5">
                  <td class="py-2 px-2 font-medium text-text">{{ gap.field }}</td>
                  <td class="py-2 px-2 text-text-secondary text-xs max-w-50 truncate">{{ gap.currentValue || 'Missing' }}</td>
                  <td class="py-2 px-2 text-text-secondary text-xs max-w-50 truncate">{{ gap.recommendedValue }}</td>
                  <td class="py-2 px-2">
                    <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      :class="{
                        'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300': gap.priority === 'high',
                        'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300': gap.priority === 'medium',
                        'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300': gap.priority === 'low',
                      }"
                    >{{ gap.priority }}</span>
                  </td>
                  <td class="py-2 px-2 text-text-secondary text-xs">{{ gap.notes }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </template>
    </div>

    <!-- ── Bottom Action Bar ──────────────────────── -->
    <div class="fixed bottom-0 left-0 right-0 bg-surface border-t border-text-secondary/10 px-4 py-3 z-50">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <!-- Left: status + URL -->
        <div class="flex items-center gap-3 min-w-0">
          <StatusBadge v-if="deliverableId" :status="status" />
          <template v-if="status === 'published' && publicUrl">
            <a :href="publicUrl" target="_blank" class="text-xs text-primary hover:underline truncate max-w-60">{{ publicUrl }}</a>
            <CopyButton :text="publicUrl" label="Copy URL" />
          </template>
        </div>

        <!-- Right: action buttons -->
        <div class="flex items-center gap-2">
          <button
            class="px-4 py-2 text-sm font-medium rounded-md bg-bg border border-text-secondary/20 text-text hover:bg-surface transition-colors disabled:opacity-50"
            :disabled="isSaving"
            @click="saveDraft"
          >
            {{ isSaving ? 'Saving...' : 'Save Draft' }}
          </button>

          <button
            class="px-4 py-2 text-sm font-medium rounded-md bg-secondary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            :disabled="isGenerating || !businessInfo.businessType"
            @click="handleGenerate"
          >
            {{ isGenerating ? 'Generating...' : 'Generate' }}
          </button>

          <button
            v-if="status === 'expired'"
            class="px-4 py-2 text-sm font-medium rounded-md bg-amber-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            :disabled="isPublishing || !deliverableId"
            @click="restoreDeliverable"
          >
            {{ isPublishing ? 'Restoring...' : 'Restore' }}
          </button>

          <button
            v-else
            class="px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            :disabled="isPublishing || !deliverableId"
            @click="publish"
          >
            {{ isPublishing ? 'Publishing...' : 'Publish' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
