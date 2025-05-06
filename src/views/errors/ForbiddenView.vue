<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <v-icon size="100" color="red-lighten-3">mdi-shield-lock-outline</v-icon>
            <h1 class="text-h3 mt-4 red--text text--darken-2">403</h1>
            <h2 class="text-h4 mb-4">Access Forbidden</h2>
            <p class="text-body-1 mb-8">
              You need to be logged in to access this page.
            </p>
            <v-btn
              color="red-darken-2"
              class="mr-4"
              @click="goToLogin"
            >
              Log In
            </v-btn>
            <v-btn
              variant="outlined"
              color="grey-darken-1"
              @click="goHome"
            >
              Go Home
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>
