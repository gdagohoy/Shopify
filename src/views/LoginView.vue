<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="login-container">
        <v-container fluid class="fill-height">
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" lg="10" xl="8">
              <v-card class="login-card" elevation="24">
                <v-row no-gutters>
                  <!-- Left side - Image/Branding -->
                  <v-col cols="12" md="6" class="login-banner d-none d-md-flex">
                    <div class="banner-content text-center">
                      <h1 class="text-h3 font-weight-bold text-white mb-4">Welcome to Shopify Rentals</h1>
                      <p class="text-subtitle-1 text-white-darken-1 px-8">
                        Your one-stop platform for renting quality products at affordable prices. 
                        Log in to browse our extensive collection.
                      </p>
                      <div class="banner-features mt-8">
                        <div class="feature-item">
                          <v-icon color="white" size="large" class="mb-2">mdi-book-open-variant</v-icon>
                          <span class="text-subtitle-2 text-white">Academic Materials</span>
                        </div>
                        <div class="feature-item">
                          <v-icon color="white" size="large" class="mb-2">mdi-basketball</v-icon>
                          <span class="text-subtitle-2 text-white">Sports Equipment</span>
                        </div>
                        <div class="feature-item">
                          <v-icon color="white" size="large" class="mb-2">mdi-bicycle</v-icon>
                          <span class="text-subtitle-2 text-white">Recreational Items</span>
                        </div>
                      </div>
                    </div>
                  </v-col>
                  
                  <!-- Right side - Login Form -->
                  <v-col cols="12" md="6">
                    <v-card-item class="pt-8 pb-0">
                      <div class="text-center mb-4">
                        <img
                          src="/public/images/ShopiyfLogo.jpg"
                          class="mx-auto mb-2"
                          width="100"
                          height="100"
                          alt="Shopify Logo"
                          style="border-radius: 50%"
                        />
                        <h2 class="text-h4 font-weight-bold red--text text--darken-2">Shopify</h2>
                        <p class="text-subtitle-1 text-medium-emphasis">Sign in to your account</p>
                      </div>
                    </v-card-item>
                    
                    <v-card-text class="px-6 pt-2 pb-4">
                      <LoginForm />
                      
                      <div class="mt-6 text-center">
                        <v-divider class="mb-4"></v-divider>
                        <p class="text-body-1">
                          Don't have an account? 
                          <RouterLink to="/register" class="text-decoration-none font-weight-medium red--text text--darken-2">
                            Register here
                          </RouterLink>
                        </p>
                      </div>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.login-container {
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px - 128px); /* Adjust for header and footer */
  padding: 2rem 0;
}

.login-card {
  border-radius: 16px;
  overflow: hidden;
}

.login-banner {
  background: linear-gradient(135deg, #c62828, #b71c1c);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjYzcxZDIyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QzMmYyZiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDY2TDAgNTBMMCA1MEwyOCA2NkwyOCA2Nkw1NiA1MEw1NiA1MEwyOCA2NkwyOCA2NiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDMyZjJmIiBzdHJva2Utd2lkdGg9IjIiPjwvcGF0aD4KPC9zdmc+');
  opacity: 0.1;
}

.banner-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.banner-features {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}
</style>
