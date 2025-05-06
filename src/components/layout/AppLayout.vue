<script setup>
import { ref, onMounted } from 'vue'
import ProfileHeader from './ProfileHeader.vue'
import { useAuthUserStore } from '@/stores/authUser'

// Use Pinia Store
const authStore = useAuthUserStore()

// Load Variables
const isLoggedIn = ref(false)
const theme = ref(localStorage.getItem('theme') ?? 'light')

//  Toggle Theme
const onToggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

// Get Authentication status from supabase
const getLoggedStatus = async () => {
  isLoggedIn.value = await authStore.isAuthenticated()
}

// Load Functions during component rendering
onMounted(() => {
  getLoggedStatus()
})
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3" color="red-darken-3">
        <h1>Shopify</h1>
        <v-spacer></v-spacer>

        <ProfileHeader v-if="isLoggedIn"></ProfileHeader>
        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          slim
          @click="onToggleTheme"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <slot name="content"></slot>
      </v-main>
      <v-footer border app color="red-darken-3">All rights reserved</v-footer>
    </v-app>
  </v-responsive>
</template>
