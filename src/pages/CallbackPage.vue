<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'

const { isAuthenticated, isLoading } = useAuth0()
const router = useRouter()

onMounted(async () => {
  // Wait for Auth0 to finish processing the callback
  while (isLoading.value) {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  if (isAuthenticated.value) {
    router.push('/dashboard')
  } else {
    router.push('/get-started')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-bg">
    <p class="text-text-secondary">Authenticating...</p>
  </div>
</template>
