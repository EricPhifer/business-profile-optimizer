<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { BusinessType } from '../types'

const businessTypes: { value: BusinessType; label: string }[] = [
  { value: 'local_service', label: 'Local Service' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'church', label: 'Church' },
  { value: 'hoa', label: 'HOA' },
  { value: 'retail', label: 'Retail' },
  { value: 'creative', label: 'Creative' },
  { value: 'technology', label: 'Technology' },
]

const form = reactive({
  contactName: '',
  businessName: '',
  email: '',
  phone: '',
  websiteUrl: '',
  businessType: '' as BusinessType | '',
  cityRegion: '',
  businessDescription: '',
  hasGbp: false,
  gbpUrl: '',
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)
const submitError = ref('')

function clearError(field: string) {
  delete errors[field]
}

async function handleSubmit() {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key])
  submitError.value = ''
  loading.value = true

  try {
    // Submit lead
    const leadRes = await fetch('/.netlify/functions/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const leadData = await leadRes.json()

    if (!leadRes.ok) {
      if (leadData.errors) {
        Object.assign(errors, leadData.errors)
      }
      loading.value = false
      return
    }

    // Store lead ID
    localStorage.setItem('pwo-lead-id', leadData.id)

    // Create checkout session
    const checkoutRes = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: leadData.id,
        email: form.email,
        businessName: form.businessName,
      }),
    })

    const checkoutData = await checkoutRes.json()

    if (!checkoutRes.ok) {
      submitError.value = 'Failed to create checkout session. Please try again.'
      loading.value = false
      return
    }

    // Redirect to Stripe
    window.location.href = checkoutData.url
  } catch {
    submitError.value = 'Something went wrong. Please try again.'
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-bg">
    <div class="max-w-2xl mx-auto px-4 py-12">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-extrabold text-primary mb-2">
          Google Business Profile Optimizer
        </h1>
        <p class="text-text-secondary text-lg">
          Get a customized optimization report for your Google Business Profile
        </p>
      </div>

      <form
        class="bg-surface rounded-lg p-8 space-y-6"
        @submit.prevent="handleSubmit"
      >
        <!-- Contact Name -->
        <div>
          <label class="block text-sm font-medium text-text mb-1" for="contactName">
            Contact Name <span class="text-red-500">*</span>
          </label>
          <input
            id="contactName"
            v-model="form.contactName"
            type="text"
            class="w-full rounded-lg border border-text-secondary/20 bg-bg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            @input="clearError('contactName')"
          />
          <p v-if="errors.contactName" class="mt-1 text-sm text-red-500">{{ errors.contactName }}</p>
        </div>

        <!-- Business Name -->
        <div>
          <label class="block text-sm font-medium text-text mb-1" for="businessName">
            Business Name <span class="text-red-500">*</span>
          </label>
          <input
            id="businessName"
            v-model="form.businessName"
            type="text"
            class="w-full rounded-lg border border-text-secondary/20 bg-bg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            @input="clearError('businessName')"
          />
          <p v-if="errors.businessName" class="mt-1 text-sm text-red-500">{{ errors.businessName }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-text mb-1" for="email">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full rounded-lg border border-text-secondary/20 bg-bg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            @input="clearError('email')"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-text mb-1" for="phone">
            Phone
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="w-full rounded-lg border border-text-secondary/20 bg-bg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Website URL -->
        <div>
          <label class="block text-sm font-medium text-text mb-1" for="websiteUrl">
            Website URL
          </label>
          <input
            id="websiteUrl"
            v-model="form.websiteUrl"
            type="text"
            placeholder="https://example.com"
            class="w-full rounded-lg border border-text-secondary/20 bg-bg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Business Type -->
        <div class="relative">
          <label class="block text-sm font-medium text-text mb-1" for="businessType">
            Business Type <span class="text-red-500">*</span>
          </label>
          <select
            id="businessType"
            v-model="form.businessType"
            class="w-full rounded-lg border border-text-secondary/20 bg-bg px-4 pr-10 py-3.5 text-text focus:outline-none focus:ring-2 focus:ring-primary h-12 appearance-none"
            @change="clearError('businessType')"
          >
            <option value="" disabled>Select a business type</option>
            <option
              v-for="bt in businessTypes"
              :key="bt.value"
              :value="bt.value"
            >
              {{ bt.label }}
            </option>
          </select>
          <svg class="pointer-events-none absolute right-3 top-9.5 w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <p v-if="errors.businessType" class="mt-1 text-sm text-red-500">{{ errors.businessType }}</p>
        </div>

        <!-- City / Region -->
        <div>
          <label class="block text-sm font-medium text-text mb-1" for="cityRegion">
            City / Region <span class="text-red-500">*</span>
          </label>
          <input
            id="cityRegion"
            v-model="form.cityRegion"
            type="text"
            class="w-full rounded-lg border border-text-secondary/20 bg-bg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            @input="clearError('cityRegion')"
          />
          <p v-if="errors.cityRegion" class="mt-1 text-sm text-red-500">{{ errors.cityRegion }}</p>
        </div>

        <!-- Business Description -->
        <div>
          <label class="block text-sm font-medium text-text mb-1" for="businessDescription">
            Brief description of your organization
          </label>
          <textarea
            id="businessDescription"
            v-model="form.businessDescription"
            rows="3"
            class="w-full rounded-lg border border-text-secondary/20 bg-bg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        <!-- Has GBP -->
        <div>
          <label class="block text-sm font-medium text-text mb-2">
            Do you have a Google Business Profile?
          </label>
          <div class="flex gap-3">
            <button
              type="button"
              class="px-6 py-2 rounded-lg font-medium transition-colors"
              :class="!form.hasGbp
                ? 'bg-primary text-white'
                : 'bg-bg border border-text-secondary/20 text-text-secondary'"
              @click="form.hasGbp = false"
            >
              No
            </button>
            <button
              type="button"
              class="px-6 py-2 rounded-lg font-medium transition-colors"
              :class="form.hasGbp
                ? 'bg-primary text-white'
                : 'bg-bg border border-text-secondary/20 text-text-secondary'"
              @click="form.hasGbp = true"
            >
              Yes
            </button>
          </div>
        </div>

        <!-- GBP URL (conditional) -->
        <div v-if="form.hasGbp">
          <label class="block text-sm font-medium text-text mb-1" for="gbpUrl">
            GBP URL
          </label>
          <input
            id="gbpUrl"
            v-model="form.gbpUrl"
            type="text"
            placeholder="https://g.co/kgs/..."
            class="w-full rounded-lg border border-text-secondary/20 bg-bg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Error message -->
        <p v-if="submitError" class="text-red-500 text-sm text-center">{{ submitError }}</p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Processing...' : 'Continue to Payment — $99' }}
        </button>
      </form>
    </div>
  </div>
</template>
