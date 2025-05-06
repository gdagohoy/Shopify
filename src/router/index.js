import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/system/DashboardView.vue'
import NotFoundView from '../views/errors/NotFoundView.vue'
import ForbiddenView from '../views/errors/ForbiddenView.vue'

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { requiresAuth: false }
    }
  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (!requiresAuth) {
    // If the route doesn't require auth, allow access
    return next()
  }
  
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      // User is authenticated, allow access
      return next()
    } else {
      // User is not authenticated, redirect to forbidden page
      return next({ name: 'forbidden' })
    }
  } catch (error) {
    console.error('Navigation guard error:', error)
    return next({ name: 'forbidden' })
  }
})

export default router
