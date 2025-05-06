<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'

const router = useRouter()
const isAuthenticated = ref(false)

const goBack = () => {
  router.go(-1)
}

const goToDashboard = () => {
  router.push('/dashboard')
}

// Check authentication status
const checkAuth = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    isAuthenticated.value = !!session
  } catch (error) {
    console.error('Auth check error:', error)
    isAuthenticated.value = false
  }
}

onMounted(() => {
  checkAuth()
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <v-icon size="100" color="grey-lighten-1">mdi-map-marker-question-outline</v-icon>
            <h1 class="text-h3 mt-4 red--text text--darken-2">404</h1>
            <h2 class="text-h4 mb-4">Page Not Found</h2>
            <p class="text-body-1 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <v-btn
              v-if="isAuthenticated"
              color="red-darken-2"
              class="mr-4"
              @click="goToDashboard"
            >
              Go to Dashboard
            </v-btn>
            <v-btn
              variant="outlined"
              color="grey-darken-1"
              @click="goBack"
            >
              Go Back
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
