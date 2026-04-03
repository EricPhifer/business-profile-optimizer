<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const success = ref(false)
const businessName = ref('')
const error = ref('')

onMounted(async () => {
  const sessionId = route.query.session_id as string
  const leadId = route.query.lead as string

  if (!sessionId || !leadId) {
    error.value = 'Missing payment information. If you believe this is an error, please contact Eric at eric@ericphifer.com.'
    loading.value = false
    return
  }

  try {
    const res = await fetch('/.netlify/functions/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, leadId }),
    })

    if (!res.ok) {
      error.value = 'Payment verification failed. If you were charged, please contact Eric at eric@ericphifer.com.'
      loading.value = false
      return
    }

    // Clear stored lead ID
    localStorage.removeItem('pwo-lead-id')

    success.value = true
    // Try to get business name from the session metadata
    businessName.value = ''
  } catch {
    error.value = 'Something went wrong verifying your payment. Please contact Eric at eric@ericphifer.com.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-bg flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-surface rounded-lg p-8 text-center">
      <!-- Loading -->
      <div v-if="loading">
        <p class="text-text-secondary text-lg">Verifying your payment...</p>
      </div>

      <!-- Success -->
      <div v-else-if="success">
        <div class="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-extrabold text-primary mb-3">Payment Confirmed!</h1>
        <p class="text-text mb-6">
          Thank you for your purchase. Eric will be in touch with your deliverable link within 1 business day.
        </p>
        <p class="text-text-secondary text-sm">
          If you have any questions, reach out to
          <a href="mailto:eric@ericphifer.com" class="text-primary underline">eric@ericphifer.com</a>
        </p>
      </div>

      <!-- Error -->
      <div v-else>
        <div class="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
        </div>
        <h1 class="text-2xl font-extrabold text-primary mb-3">Something Went Wrong</h1>
        <p class="text-text">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
