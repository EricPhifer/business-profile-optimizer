<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CopyButton from '../components/ui/CopyButton.vue'
import type { DeliverableContent, Track, BusinessType, GooglePlacesDetail } from '../types'

interface PublicDeliverable {
  id: string
  businessName: string
  contactName: string
  businessType: BusinessType
  cityRegion: string
  track: Track
  content: DeliverableContent
  gbpData: GooglePlacesDetail | null
  publishedAt: number
  expiresAt: number | null
}

const route = useRoute()
const loading = ref(true)
const expired = ref(false)
const notFound = ref(false)
const deliverable = ref<PublicDeliverable | null>(null)

const content = computed(() => deliverable.value?.content ?? null)
const isTrackA = computed(() => deliverable.value?.track === 'A')
const isTrackB = computed(() => deliverable.value?.track === 'B')

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatServices(services: DeliverableContent['services']): string {
  return services.map((s) => `${s.name}: ${s.description}`).join('\n\n')
}

function formatQA(pairs: DeliverableContent['qAndA']): string {
  return pairs.map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')
}

function formatPost(post: { body: string; cta: string }): string {
  return `${post.body}\n\nCall to Action: ${post.cta}`
}

const highPhotos = computed(() => content.value?.photoChecklist.filter((p) => p.priority === 'high') ?? [])
const mediumPhotos = computed(() => content.value?.photoChecklist.filter((p) => p.priority === 'medium') ?? [])
const lowPhotos = computed(() => content.value?.photoChecklist.filter((p) => p.priority === 'low') ?? [])

function printChecklist() {
  window.print()
}

onMounted(async () => {
  const token = route.params.token as string
  try {
    const res = await fetch(`/.netlify/functions/get-deliverable-public?token=${encodeURIComponent(token)}`)
    if (res.status === 404) {
      notFound.value = true
      loading.value = false
      return
    }
    const data = await res.json()
    if (data.expired) {
      expired.value = true
    } else {
      deliverable.value = data.deliverable
    }
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="min-h-screen bg-bg flex items-center justify-center">
    <div class="text-text-secondary">Loading your report...</div>
  </div>

  <!-- Expired / Not Found -->
  <div v-else-if="expired || notFound" class="min-h-screen bg-bg flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <div class="text-2xl font-extrabold text-primary mb-2">Phifer Web Solutions</div>
      <div class="h-px bg-text-secondary/10 my-6" />
      <p class="text-text text-lg mb-2">This report is no longer active.</p>
      <p class="text-text-secondary">
        Contact Eric Phifer to restore access.<br />
        <a href="mailto:eric@ericphiferllc.com" class="text-primary hover:underline">eric@ericphiferllc.com</a>
      </p>
    </div>
  </div>

  <!-- Full deliverable -->
  <div v-else-if="deliverable && content" class="min-h-screen bg-white">

    <!-- ── Public Header ──────────────────────────── -->
    <header class="no-print border-b border-gray-100 px-4 py-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="text-lg font-extrabold text-primary">Phifer Web Solutions</div>
        <div class="text-sm text-text-secondary hidden sm:block">Google Business Profile Optimizer</div>
      </div>
    </header>

    <!-- ── Hero Section ───────────────────────────── -->
    <section class="no-print bg-surface px-4 py-10">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-3xl md:text-4xl font-extrabold text-text mb-2">{{ deliverable.businessName }}</h1>
        <p class="text-text-secondary text-lg mb-4">{{ deliverable.cityRegion }}</p>
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
          :class="isTrackA ? 'bg-stone-100 text-stone-700' : 'bg-amber-50 text-amber-800'">
          <template v-if="isTrackA">GBP Setup Guide &mdash; Your profile content and setup walkthrough</template>
          <template v-else>GBP Optimization Report &mdash; Your gap analysis and replacement content</template>
        </div>
        <p class="text-sm text-text-secondary">Generated on {{ formatDate(deliverable.publishedAt) }}</p>
        <p v-if="deliverable.expiresAt" class="text-xs text-text-secondary mt-1">
          This report is available until {{ formatDate(deliverable.expiresAt) }}.
        </p>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">

      <!-- ══════════════════════════════════════════ -->
      <!-- Section 1 — Track A: Setup / Track B: Gap -->
      <!-- ══════════════════════════════════════════ -->
      <section class="no-print bg-white rounded-lg border border-gray-200 p-6 md:p-8">

        <!-- Track A: Setup Walkthrough -->
        <template v-if="isTrackA">
          <h2 class="text-xl font-bold text-text mb-2">GBP Setup Walkthrough</h2>
          <p class="text-sm text-text-secondary mb-6">Follow these steps to create and optimize your Google Business Profile from scratch.</p>

          <div class="space-y-6">
            <!-- Step 1 -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Go to Google Business Profile</h3>
                <p class="text-sm text-text-secondary">Visit <span class="font-medium text-primary">business.google.com</span> and click "Add your business to Google." Sign in with the Google account you want to manage the profile from.</p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Enter your business name</h3>
                <p class="text-sm text-text-secondary">Type your exact business name. If Google suggests a match, make sure it's your business before claiming it.</p>
              </div>
            </div>

            <!-- Step 3 — Categories -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Select your business category</h3>
                <p class="text-sm text-text-secondary mb-2">This is your primary category. You'll add secondary categories after setup is complete.</p>
                <div class="bg-surface rounded-md p-3 flex items-center justify-between">
                  <span class="text-sm font-medium text-text">{{ content.categories.primary }}</span>
                  <CopyButton :text="content.categories.primary" />
                </div>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">4</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Add your location or service area</h3>
                <p class="text-sm text-text-secondary">If you serve customers at your location, add your address. If you go to customers, add your service area instead. Your region: <span class="font-medium">{{ deliverable.cityRegion }}</span></p>
              </div>
            </div>

            <!-- Step 5 -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">5</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Add your phone number</h3>
                <p class="text-sm text-text-secondary">Use a local phone number whenever possible. This builds trust and helps with local search rankings.</p>
              </div>
            </div>

            <!-- Step 6 -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">6</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Add your website</h3>
                <p class="text-sm text-text-secondary">Link your website so customers can learn more about you. If you don't have one yet, you can add it later.</p>
              </div>
            </div>

            <!-- Step 7 -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">7</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Verify your business</h3>
                <p class="text-sm text-text-secondary">Google may verify you by postcard, phone call, email, or video. This usually takes a few days. You can continue editing your profile while you wait.</p>
              </div>
            </div>

            <!-- Step 8 — Description -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">8</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Complete your profile &mdash; Business Description</h3>
                <p class="text-sm text-text-secondary mb-2">In your GBP dashboard, go to "Edit profile" and add this description. It's optimized for how people search for organizations like yours.</p>
                <div class="bg-surface rounded-md p-4">
                  <p class="text-sm text-text whitespace-pre-wrap mb-2">{{ content.description.optimized }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-text-secondary">{{ content.description.optimized.length }} of 750 characters</span>
                    <CopyButton :text="content.description.optimized" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 9 — Secondary Categories -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">9</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Add secondary categories</h3>
                <p class="text-sm text-text-secondary mb-2">In "Edit profile &rarr; Business category," add these secondary categories that match your actual services.</p>
                <div class="bg-surface rounded-md p-3 mb-2">
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span v-for="cat in content.categories.secondary" :key="cat" class="px-2.5 py-1 rounded-full bg-white text-xs font-medium text-text border border-gray-200">{{ cat }}</span>
                  </div>
                  <CopyButton :text="content.categories.secondary.join('\n')" label="Copy All" />
                </div>
                <p class="text-xs text-text-secondary italic">{{ content.categories.rationale }}</p>
              </div>
            </div>

            <!-- Step 10 — Services -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">10</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Add your services</h3>
                <p class="text-sm text-text-secondary mb-2">Go to "Edit profile &rarr; Services." Each service gets its own name and description.</p>
                <div class="space-y-2">
                  <div v-for="svc in content.services" :key="svc.name" class="bg-surface rounded-md p-3 flex items-start justify-between gap-2">
                    <div>
                      <div class="text-sm font-medium text-text">{{ svc.name }}</div>
                      <div class="text-xs text-text-secondary mt-0.5">{{ svc.description }}</div>
                    </div>
                    <CopyButton :text="`${svc.name}: ${svc.description}`" class="shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 11 — Q&A -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">11</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Seed your Q&amp;A</h3>
                <p class="text-sm text-text-secondary mb-2">Search for your business on Google Maps and click "Ask a question." Post each question, then answer it from your business account.</p>
                <div class="space-y-2">
                  <div v-for="qa in content.qAndA" :key="qa.question" class="bg-surface rounded-md p-3 flex items-start justify-between gap-2">
                    <div>
                      <div class="text-sm font-semibold text-text">{{ qa.question }}</div>
                      <div class="text-xs text-text-secondary mt-1">{{ qa.answer }}</div>
                    </div>
                    <CopyButton :text="`Q: ${qa.question}\nA: ${qa.answer}`" class="shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 12 — Photos -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">12</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Post your photos</h3>
                <p class="text-sm text-text-secondary mb-2">In your GBP dashboard, click "Add photos." Use this checklist to guide which photos to upload first.</p>
                <p class="text-xs text-text-secondary italic mb-2">See the full Photo Checklist section below for details and a printable version.</p>
              </div>
            </div>

            <!-- Step 13 — Posts -->
            <div class="flex gap-4">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">13</div>
              <div class="flex-1">
                <h3 class="font-semibold text-text mb-1">Publish your first 3 posts</h3>
                <p class="text-sm text-text-secondary mb-2">In your GBP dashboard, click "Add update." Post these three updates to start building activity on your profile.</p>
                <p class="text-xs text-text-secondary italic">See the Posts section below for your pre-written content.</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Track B: Gap Analysis -->
        <template v-else-if="isTrackB && content.gapAnalysis">
          <h2 class="text-xl font-bold text-text mb-2">Profile Assessment</h2>
          <p class="text-sm text-text-secondary mb-6">Here's what needs attention. The sections below contain your replacement content.</p>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 text-left">
                  <th class="py-2.5 px-3 font-semibold text-text">Field</th>
                  <th class="py-2.5 px-3 font-semibold text-text">Your Current Value</th>
                  <th class="py-2.5 px-3 font-semibold text-text">Recommended</th>
                  <th class="py-2.5 px-3 font-semibold text-text">Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(gap, i) in content.gapAnalysis" :key="i" class="border-b border-gray-100">
                  <td class="py-2.5 px-3 font-medium text-text">{{ gap.field }}</td>
                  <td class="py-2.5 px-3 text-text-secondary text-xs">{{ gap.currentValue || 'Missing' }}</td>
                  <td class="py-2.5 px-3 text-text-secondary text-xs max-w-48 truncate">{{ gap.recommendedValue }}</td>
                  <td class="py-2.5 px-3">
                    <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      :class="{
                        'bg-red-50 text-red-600': gap.priority === 'high',
                        'bg-amber-50 text-amber-600': gap.priority === 'medium',
                        'bg-gray-100 text-gray-500': gap.priority === 'low',
                      }"
                    >{{ gap.priority }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </section>

      <!-- ══════════════════════════════════════════ -->
      <!-- Section 2 — Business Description          -->
      <!-- ══════════════════════════════════════════ -->
      <section class="no-print bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <h2 class="text-xl font-bold text-text mb-1">
          {{ isTrackA ? 'Your Business Description' : 'Business Description' }}
        </h2>
        <p v-if="isTrackA" class="text-sm text-text-secondary mb-4">
          Copy this into your GBP profile under "Business information &rarr; Description." It's optimized for how people search for organizations like yours.
        </p>

        <!-- Track A: single description -->
        <template v-if="isTrackA">
          <div class="bg-surface rounded-md p-5">
            <p class="text-sm text-text whitespace-pre-wrap leading-relaxed">{{ content.description.optimized }}</p>
          </div>
          <div class="flex items-center justify-between mt-3">
            <span class="text-xs text-text-secondary">{{ content.description.optimized.length }} of 750 characters</span>
            <CopyButton :text="content.description.optimized" />
          </div>
        </template>

        <!-- Track B: current vs optimized -->
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div class="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Current Description</div>
              <div class="bg-gray-50 rounded-md p-4 min-h-32">
                <template v-if="content.description.current">
                  <p class="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{{ content.description.current }}</p>
                  <div class="text-xs text-gray-400 mt-2">{{ content.description.current.length }} characters</div>
                </template>
                <p v-else class="text-sm text-gray-400 italic">No description found on your profile.</p>
              </div>
            </div>
            <div>
              <div class="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Optimized Description</div>
              <div class="bg-surface rounded-md p-4 border border-primary/20 min-h-32">
                <p class="text-sm text-text whitespace-pre-wrap leading-relaxed">{{ content.description.optimized }}</p>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs text-text-secondary">{{ content.description.optimized.length }} characters</span>
                  <CopyButton :text="content.description.optimized" />
                </div>
              </div>
            </div>
          </div>
          <p v-if="content.description.current" class="text-xs text-text-secondary mt-3">
            The optimized version is {{ content.description.optimized.length - (content.description.current?.length || 0) }} characters
            {{ content.description.optimized.length > (content.description.current?.length || 0) ? 'longer' : 'shorter' }}
            and includes location and service signals.
          </p>
        </template>
      </section>

      <!-- ══════════════════════════════════════════ -->
      <!-- Section 3 — Categories                     -->
      <!-- ══════════════════════════════════════════ -->
      <section class="no-print bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <h2 class="text-xl font-bold text-text mb-4">Category Recommendations</h2>

        <div class="mb-4">
          <div class="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Primary Category</div>
          <div class="inline-flex items-center gap-3 bg-primary/10 rounded-lg px-4 py-2.5">
            <span class="text-sm font-semibold text-primary">{{ content.categories.primary }}</span>
            <CopyButton :text="content.categories.primary" />
          </div>
        </div>

        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs font-semibold text-text-secondary uppercase tracking-wide">Secondary Categories</div>
            <CopyButton :text="content.categories.secondary.join('\n')" label="Copy All" />
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="cat in content.categories.secondary" :key="cat"
              class="px-3 py-1.5 rounded-full bg-surface text-xs font-medium text-text border border-gray-200">
              {{ cat }}
            </span>
          </div>
        </div>

        <p class="text-xs text-text-secondary italic">{{ content.categories.rationale }}</p>
        <p class="text-xs text-text-secondary mt-2">
          You'll set your primary category during setup. Secondary categories are added in your GBP dashboard under "Edit profile &rarr; Business category."
        </p>
      </section>

      <!-- ══════════════════════════════════════════ -->
      <!-- Section 4 — Services                       -->
      <!-- ══════════════════════════════════════════ -->
      <section class="no-print bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <div class="flex items-start justify-between mb-1">
          <h2 class="text-xl font-bold text-text">Your Services List</h2>
          <CopyButton :text="formatServices(content.services)" label="Copy All Services" />
        </div>
        <p class="text-sm text-text-secondary mb-4">Add these in GBP under "Edit profile &rarr; Services." Each entry gets its own name and description.</p>

        <div class="space-y-3">
          <div v-for="svc in content.services" :key="svc.name"
            class="bg-surface rounded-md p-4 flex items-start justify-between gap-3">
            <div>
              <div class="text-sm font-semibold text-text">{{ svc.name }}</div>
              <div class="text-sm text-text-secondary mt-0.5">{{ svc.description }}</div>
            </div>
            <CopyButton :text="`${svc.name}: ${svc.description}`" class="shrink-0" />
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════ -->
      <!-- Section 5 — Q&A Bank                       -->
      <!-- ══════════════════════════════════════════ -->
      <section class="no-print bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <div class="flex items-start justify-between mb-1">
          <h2 class="text-xl font-bold text-text">Pre-Written Q&amp;A</h2>
          <CopyButton :text="formatQA(content.qAndA)" label="Copy All Q&A" />
        </div>
        <p class="text-sm text-text-secondary mb-4">
          Google's Q&amp;A section is public. Seed it yourself by searching your business on Google Maps, clicking "Ask a question," and pasting these questions &mdash; then answer them from your business account.
        </p>

        <div class="space-y-3">
          <div v-for="qa in content.qAndA" :key="qa.question"
            class="bg-surface rounded-md p-4 flex items-start justify-between gap-3">
            <div>
              <div class="text-sm font-semibold text-text">{{ qa.question }}</div>
              <div class="text-sm text-text-secondary mt-1">{{ qa.answer }}</div>
            </div>
            <CopyButton :text="`Q: ${qa.question}\nA: ${qa.answer}`" class="shrink-0" />
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════ -->
      <!-- Section 6 — Photo Checklist                -->
      <!-- ══════════════════════════════════════════ -->
      <section class="bg-white rounded-lg border border-gray-200 p-6 md:p-8 print-section">
        <div class="flex items-start justify-between mb-1 no-print">
          <h2 class="text-xl font-bold text-text">Photo Checklist</h2>
          <button
            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-surface text-text-secondary hover:opacity-80 transition-opacity"
            @click="printChecklist"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print Checklist
          </button>
        </div>
        <!-- Print header (only visible in print) -->
        <h2 class="text-xl font-bold text-gray-900 mb-1 hidden print:block">Photo Checklist &mdash; {{ deliverable.businessName }}</h2>
        <p class="text-sm text-text-secondary mb-6">Photos are one of the highest-impact GBP signals. This checklist is specific to your organization type.</p>

        <!-- High Priority -->
        <div v-if="highPhotos.length > 0" class="mb-5">
          <div class="text-xs font-semibold uppercase tracking-wide text-red-500 mb-2">High Priority</div>
          <div class="space-y-2">
            <div v-for="photo in highPhotos" :key="photo.item" class="flex gap-3 items-start">
              <div class="shrink-0 w-5 h-5 mt-0.5 rounded border-2 border-red-300" />
              <div>
                <div class="text-sm font-medium text-text">{{ photo.item }}</div>
                <div class="text-xs text-text-secondary mt-0.5">{{ photo.why }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Medium Priority -->
        <div v-if="mediumPhotos.length > 0" class="mb-5">
          <div class="text-xs font-semibold uppercase tracking-wide text-amber-500 mb-2">Medium Priority</div>
          <div class="space-y-2">
            <div v-for="photo in mediumPhotos" :key="photo.item" class="flex gap-3 items-start">
              <div class="shrink-0 w-5 h-5 mt-0.5 rounded border-2 border-amber-300" />
              <div>
                <div class="text-sm font-medium text-text">{{ photo.item }}</div>
                <div class="text-xs text-text-secondary mt-0.5">{{ photo.why }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lower Priority -->
        <div v-if="lowPhotos.length > 0">
          <div class="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Lower Priority</div>
          <div class="space-y-2">
            <div v-for="photo in lowPhotos" :key="photo.item" class="flex gap-3 items-start">
              <div class="shrink-0 w-5 h-5 mt-0.5 rounded border-2 border-gray-300" />
              <div>
                <div class="text-sm font-medium text-text">{{ photo.item }}</div>
                <div class="text-xs text-text-secondary mt-0.5">{{ photo.why }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════ -->
      <!-- Section 7 — First 3 Posts                  -->
      <!-- ══════════════════════════════════════════ -->
      <section class="no-print bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <h2 class="text-xl font-bold text-text mb-1">Your First 3 Google Posts</h2>
        <p class="text-sm text-text-secondary mb-4">Post these in GBP under "Add update." Posts expire after 6 months &mdash; set a reminder to refresh them.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="post in content.posts" :key="post.type"
            class="bg-surface rounded-lg p-4 flex flex-col">
            <div class="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
              {{ post.type === 'intro' ? 'Introduction' : post.type === 'event' ? 'Event or Program' : 'Community Impact' }}
            </div>
            <p class="text-sm text-text flex-1 whitespace-pre-wrap leading-relaxed mb-3">{{ post.body }}</p>
            <p class="text-xs text-text-secondary mb-3">Call to Action: {{ post.cta }}</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-xs text-gray-400">{{ post.body.length }} / 1500</span>
              <CopyButton :text="formatPost(post)" />
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════ -->
      <!-- Section 8 — Review Response Templates      -->
      <!-- ══════════════════════════════════════════ -->
      <section class="no-print bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <h2 class="text-xl font-bold text-text mb-1">Review Response Templates</h2>
        <p class="text-sm text-text-secondary mb-4">When reviews come in, respond within 24&ndash;48 hours. These templates give you a starting point &mdash; personalize them before posting.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-surface rounded-lg p-4">
            <div class="text-xs font-semibold uppercase tracking-wide text-secondary mb-2">Positive Review Response</div>
            <p class="text-sm text-text whitespace-pre-wrap leading-relaxed mb-3">{{ content.reviewTemplates.positive }}</p>
            <CopyButton :text="content.reviewTemplates.positive" />
          </div>
          <div class="bg-surface rounded-lg p-4">
            <div class="text-xs font-semibold uppercase tracking-wide text-accent mb-2">Mixed or Critical Review Response</div>
            <p class="text-sm text-text whitespace-pre-wrap leading-relaxed mb-3">{{ content.reviewTemplates.mixed }}</p>
            <CopyButton :text="content.reviewTemplates.mixed" />
          </div>
        </div>

        <p class="text-xs text-text-secondary mt-3 italic">Never copy-paste without personalizing. Reference something specific from the review when you can.</p>
      </section>

    </div>

    <!-- ── Footer ─────────────────────────────────── -->
    <footer class="no-print border-t border-gray-100 px-4 py-8 mt-8">
      <div class="max-w-4xl mx-auto text-center space-y-3">
        <p class="text-sm text-text-secondary">
          Powered by <a href="https://phiferwebsolutions.com" target="_blank" rel="noopener" class="text-primary hover:underline">Phifer Web Solutions</a>
        </p>
        <p class="text-sm text-text-secondary">
          Ready to match your profile with a website that works just as hard?
          <a href="https://health-check.isyourwebsitegood.com/get-started" target="_blank" rel="noopener" class="text-primary hover:underline">Check Your Website</a>
        </p>
        <p class="text-xs text-gray-400">
          <a href="mailto:eric@ericphiferllc.com" class="hover:text-text-secondary">eric@ericphiferllc.com</a>
        </p>
      </div>
    </footer>
  </div>
</template>
