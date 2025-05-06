<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row align="center" justify="end">
        <v-col cols="12" sm="8" md="6" lg="4" class="mt-10">
          <v-card class="mx-auto" max-width="500" elevation="20">
            <v-card-title>
              <div class="text-center">
                <img
                  aspect-ratio="1"
                  src="/public/images/ShopiyfLogo.jpg"
                  class="mx-auto"
                  width="100"
                  contain
                  alt="Shopify Logo"
                  style="border-radius: 100px"
                />
                <h3 class="font-weight-black text-center">Shopify</h3>
              </div>
              <v-divider></v-divider>
            </v-card-title>
            <v-card-text class="bg-surface-light pt-4">
              <RegisterForm></RegisterForm>
              <v-divider class="mt-5"> </v-divider>
              <h5 class="mt-2">
                Already have an account?<RouterLink to="/" class="text-decoration-none">
                  <span class="mx-1" style="color: red">Login here</span>
                </RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
h3 {
  color: #e53935;
}
</style>
