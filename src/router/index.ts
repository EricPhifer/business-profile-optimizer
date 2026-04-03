import { createRouter, createWebHistory } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const knownRoutes = ['dashboard', 'get-started', 'payment-success', 'callback']

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/get-started',
    },
    {
      path: '/get-started',
      name: 'get-started',
      component: () => import('../pages/GetStartedPage.vue'),
    },
    {
      path: '/payment-success',
      name: 'payment-success',
      component: () => import('../pages/PaymentSuccessPage.vue'),
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('../pages/CallbackPage.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../pages/dashboard/DeliverableListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/edit/:id',
      name: 'dashboard-edit',
      component: () => import('../pages/dashboard/DeliverableEditorView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:token',
      name: 'deliverable',
      component: () => import('../pages/DeliverablePage.vue'),
      beforeEnter: (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
        const token = to.params.token as string
        if (knownRoutes.includes(token)) {
          next({ path: `/${token}` })
        } else {
          next()
        }
      },
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  // Wait for Auth0 to finish loading
  if (isLoading.value) {
    await new Promise<void>((resolve) => {
      const unwatch = (function checkLoading() {
        if (!isLoading.value) {
          resolve()
          return
        }
        setTimeout(checkLoading, 50)
      })()
      void unwatch
    })
  }

  if (!isAuthenticated.value) {
    await loginWithRedirect({
      appState: { target: to.fullPath },
    })
    return false
  }

  return true
})

export default router
