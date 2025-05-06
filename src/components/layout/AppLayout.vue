<script setup>
import { ref, onMounted } from 'vue'
import ProfileHeader from './ProfileHeader.vue'
import { useAuthUserStore } from '@/stores/authUser'

// Use Pinia Store
const authStore = useAuthUserStore()

// Load Variables
const isLoggedIn = ref(false)
const theme = ref(localStorage.getItem('theme') ?? 'light')
const currentYear = new Date().getFullYear()

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
      
      <v-footer border app color="red-darken-3" class="py-2">
        <v-row no-gutters align="center" justify="space-between">
          <v-col cols="auto" class="text-white text-caption px-3">
            Shopify Rentals - Your one-stop platform for renting quality products
          </v-col>
          
          <v-col cols="auto" class="text-white text-caption px-3">
            &copy; {{ currentYear }} All rights reserved
          </v-col>
          
          <v-col cols="auto" class="d-flex px-3">
            <v-btn icon density="compact" variant="text" color="white" class="mx-1">
              <v-icon size="small">mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon density="compact" variant="text" color="white" class="mx-1">
              <v-icon size="small">mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon density="compact" variant="text" color="white" class="mx-1">
              <v-icon size="small">mdi-email</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.v-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
</style>
