<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <AppLayout>
    <template #content>
      <div class="register-container">
        <v-container fluid class="fill-height">
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" lg="10" xl="8">
              <v-card class="register-card" elevation="24">
                <v-row no-gutters>
                  <!-- Left side - Register Form -->
                  <v-col cols="12" md="6" order="2" order-md="1">
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
                        <p class="text-subtitle-1 text-medium-emphasis">Create a new account</p>
                      </div>
                    </v-card-item>
                    
                    <v-card-text class="px-6 pt-2 pb-4">
                      <RegisterForm />
                      
                      <div class="mt-6 text-center">
                        <v-divider class="mb-4"></v-divider>
                        <p class="text-body-1">
                          Already have an account? 
                          <RouterLink to="/login" class="text-decoration-none font-weight-medium red--text text--darken-2">
                            Login here
                          </RouterLink>
                        </p>
                      </div>
                    </v-card-text>
                  </v-col>
                  
                  <!-- Right side - Image/Branding -->
                  <v-col cols="12" md="6" order="1" order-md="2" class="register-banner d-none d-md-flex">
                    <div class="banner-content text-center">
                      <h1 class="text-h3 font-weight-bold text-white mb-4">Join Shopify Rentals</h1>
                      <p class="text-subtitle-1 text-white-darken-1 px-8">
                        Create an account to start renting quality products at affordable prices.
                        Register now to access our extensive collection.
                      </p>
                      <div class="banner-benefits mt-8">
                        <div class="benefit-item">
                          <v-icon color="white" size="large" class="mb-2">mdi-account-check</v-icon>
                          <div>
                            <h3 class="text-subtitle-1 text-white font-weight-bold mb-1">Easy Registration</h3>
                            <p class="text-body-2 text-white-darken-1">Simple sign-up process to get started quickly</p>
                          </div>
                        </div>
                        <div class="benefit-item">
                          <v-icon color="white" size="large" class="mb-2">mdi-shield-check</v-icon>
                          <div>
                            <h3 class="text-subtitle-1 text-white font-weight-bold mb-1">Secure Platform</h3>
                            <p class="text-body-2 text-white-darken-1">Your data is protected with top-notch security</p>
                          </div>
                        </div>
                        <div class="benefit-item">
                          <v-icon color="white" size="large" class="mb-2">mdi-cart-check</v-icon>
                          <div>
                            <h3 class="text-subtitle-1 text-white font-weight-bold mb-1">Instant Access</h3>
                            <p class="text-body-2 text-white-darken-1">Immediately browse and rent products</p>
                          </div>
                        </div>
                      </div>
                    </div>
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
.register-container {
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px - 128px); /* Adjust for header and footer */
  padding: 2rem 0;
}

.register-card {
  border-radius: 16px;
  overflow: hidden;
}

.register-banner {
  background: linear-gradient(135deg, #c62828, #b71c1c);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.register-banner::before {
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

.banner-benefits {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
  padding: 0 2rem;
}
</style>
