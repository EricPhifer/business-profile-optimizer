<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import TrackBadge from '../../components/ui/TrackBadge.vue'
import CopyButton from '../../components/ui/CopyButton.vue'
import type { DeliverableStatus, Track } from '../../types'

interface DeliverableRow {
  id: string
  business_name: string
  contact_name: string
  email: string
  track: Track
  status: DeliverableStatus
  expires_at: number | null
  published_at: number | null
  view_count: number
  token: string
}

const router = useRouter()
const route = useRoute()
const { idTokenClaims } = useAuth0()

function getAuthToken(): string {
  return idTokenClaims.value?.__raw || ''
}

const deliverables = ref<DeliverableRow[]>([])
const loading = ref(true)
const error = ref('')
const activeFilter = ref<'all' | DeliverableStatus>('all')

const filters: { label: string; value: 'all' | DeliverableStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Expired', value: 'expired' },
  { label: 'Archived', value: 'archived' },
]

const filtered = computed(() => {
  if (activeFilter.value === 'all') return deliverables.value
  return deliverables.value.filter((d) => d.status === activeFilter.value)
})

function formatDate(ts: number | null): string {
  if (!ts) return '\u2014'
  return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function expiresDisplay(row: DeliverableRow): string {
  if (!row.published_at) return '\u2014'
  if (row.expires_at === null) return 'Permanent'
  return formatDate(row.expires_at)
}

function publicUrl(token: string): string {
  return `${window.location.origin}/${token}`
}

async function restore(id: string) {
  const token = await getAuthToken()
  await fetch('/.netlify/functions/restore-deliverable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id }),
  })
  await loadDeliverables()
}

async function loadDeliverables() {
  loading.value = true
  error.value = ''
  try {
    const token = await getAuthToken()
    const res = await fetch('/.netlify/functions/get-deliverables', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Failed to load')
    const data = await res.json()
    deliverables.value = data.deliverables
  } catch {
    error.value = 'Failed to load deliverables.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // If ?lead= param, redirect directly to editor
  const leadId = route.query.lead as string
  if (leadId) {
    router.replace(`/dashboard/edit/new?lead=${leadId}`)
    return
  }
  await loadDeliverables()
})
</script>

<template>
  <div class="min-h-screen bg-bg">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Top bar -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-extrabold text-primary">Profile Optimizer &mdash; Deliverables</h1>
        <button
          class="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          @click="router.push('/dashboard/edit/new')"
        >
          New Deliverable
        </button>
      </div>

      <!-- Filter tabs -->
      <div class="flex gap-1 mb-6 border-b border-text-secondary/10">
        <button
          v-for="f in filters"
          :key="f.value"
          class="px-4 py-2 text-sm font-medium transition-colors rounded-t-md"
          :class="activeFilter === f.value
            ? 'bg-surface text-primary border-b-2 border-primary'
            : 'text-text-secondary hover:text-text'"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-text-secondary">Loading...</div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12 text-red-500">{{ error }}</div>

      <!-- Empty state -->
      <div v-else-if="filtered.length === 0" class="text-center py-16">
        <p class="text-text-secondary mb-4">No deliverables yet. Create one from a paid lead.</p>
        <button
          class="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          @click="router.push('/dashboard/edit/new')"
        >
          New Deliverable
        </button>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-text-secondary/10 text-left">
              <th class="py-3 px-3 font-semibold text-text">Business</th>
              <th class="py-3 px-3 font-semibold text-text">Track</th>
              <th class="py-3 px-3 font-semibold text-text">Status</th>
              <th class="py-3 px-3 font-semibold text-text">Expires</th>
              <th class="py-3 px-3 font-semibold text-text">Views</th>
              <th class="py-3 px-3 font-semibold text-text">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="d in filtered"
              :key="d.id"
              class="border-b border-text-secondary/5 hover:bg-surface/50 transition-colors"
            >
              <td class="py-3 px-3">
                <div class="font-medium text-text">{{ d.business_name }}</div>
                <div class="text-xs text-text-secondary">{{ d.contact_name }}</div>
              </td>
              <td class="py-3 px-3"><TrackBadge :track="d.track" /></td>
              <td class="py-3 px-3"><StatusBadge :status="d.status" /></td>
              <td class="py-3 px-3 text-text-secondary">{{ expiresDisplay(d) }}</td>
              <td class="py-3 px-3 text-text-secondary">{{ d.view_count }}</td>
              <td class="py-3 px-3">
                <div class="flex items-center gap-2">
                  <button
                    class="px-3 py-1 text-xs font-medium rounded-md bg-surface text-primary hover:opacity-80 transition-opacity"
                    @click="router.push(`/dashboard/edit/${d.id}`)"
                  >
                    Edit
                  </button>
                  <CopyButton
                    v-if="d.status === 'published'"
                    :text="publicUrl(d.token)"
                    label="Copy URL"
                  />
                  <button
                    v-if="d.status === 'expired'"
                    class="px-3 py-1 text-xs font-medium rounded-md bg-amber-100 text-amber-700 hover:opacity-80 transition-opacity dark:bg-amber-900 dark:text-amber-300"
                    @click="restore(d.id)"
                  >
                    Restore
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
