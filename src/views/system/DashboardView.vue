<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted, computed, provide } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthUserStore } from '@/stores/authUser'
import RentProductDialog from '@/components/products/RentProductDialog.vue'
import ProductDetailsModal from '@/components/products/ProductDetailsModal.vue'
import RentalHistory from '@/components/rentals/RentalHistory.vue'
import { initializeDatabase } from '@/utils/initializeDatabase'

// Use stores
const productsStore = useProductsStore()
const authStore = useAuthUserStore()

// State
const selectedCategory = ref(null)
const searchQuery = ref('')
const loading = ref(true)
const selectedProduct = ref(null)
const showRentDialog = ref(false)
const showDetailsModal = ref(false)
const showRentalHistory = ref(false)
const initializingDb = ref(false)
const rentalHistoryKey = ref(0) // Key to force re-render of rental history

// Computed properties
const filteredProducts = computed(() => {
  let products = selectedCategory.value
    ? productsStore.products.filter((p) => p.category_id === selectedCategory.value)
    : productsStore.products

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(
      (p) =>
        p.product_name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query),
    )
  }

  return products
})

// Methods
const selectCategory = (categoryId) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
}

const getCategoryName = (categoryId) => {
  const category = productsStore.categories.find((c) => c.id === categoryId)
  return category ? category.category_name : 'Unknown'
}

const openRentDialog = (product) => {
  selectedProduct.value = product
  showRentDialog.value = true
}

const openDetailsModal = (product) => {
  selectedProduct.value = product
  showDetailsModal.value = true
}

const handleRentalSuccess = () => {
  // Refresh products after successful rental
  productsStore.fetchProducts()

  // Force refresh of rental history component
  rentalHistoryKey.value++

  // Show rental history after successful rental
  setTimeout(() => {
    showRentalHistory.value = true
  }, 500)
}

const openRentalHistory = () => {
  // Force refresh rental history before showing
  rentalHistoryKey.value++
  showRentalHistory.value = true
}

// Initialize database with products from productsList.js
const setupDatabase = async () => {
  initializingDb.value = true
  try {
    await initializeDatabase()
  } catch (error) {
    console.error('Error setting up database:', error)
  } finally {
    initializingDb.value = false
  }
}

// Provide refresh function to child components
provide('refreshRentalHistory', () => {
  rentalHistoryKey.value++
})

// Load data on component mount
onMounted(async () => {
  loading.value = true

  // Initialize database with products
  await setupDatabase()

  // Then fetch categories and products
  await productsStore.fetchCategories()
  await productsStore.fetchProducts()

  loading.value = false
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <!-- Page Header -->
        <v-row class="mb-4">
          <v-col cols="12" md="8">
            <h1 class="text-h4 font-weight-bold text-red-darken-3">Rent Well</h1>
            <p class="text-subtitle-1">Find and rent the products you need</p>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end align-center">
            <v-btn
              color="red-darken-2"
              variant="outlined"
              prepend-icon="mdi-history"
              @click="openRentalHistory"
            >
              Rental History
            </v-btn>
          </v-col>
        </v-row>

        <!-- Search and Filter -->
        <v-row>
          <v-col cols="12" sm="8" md="9">
            <v-text-field
              v-model="searchQuery"
              label="Search products"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              class="rounded-lg"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-select
              v-model="selectedCategory"
              :items="[{ id: null, category_name: 'All' }, ...productsStore.categories]"
              item-title="category_name"
              item-value="id"
              label="Category"
              variant="outlined"
              density="comfortable"
              hide-details
              class="rounded-lg"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Categories Chips -->
        <v-row class="mt-2">
          <v-col cols="12">
            <v-chip-group>
              <v-chip
                color="red-darken-2"
                :text-color="selectedCategory === null ? 'white' : ''"
                class="ma-1"
                @click="selectedCategory = null"
              >
                All
              </v-chip>
              <v-chip
                v-for="category in productsStore.categories"
                :key="category.id"
                :color="selectedCategory === category.id ? 'red-darken-2' : ''"
                :text-color="selectedCategory === category.id ? 'white' : ''"
                class="ma-1"
                @click="selectCategory(category.id)"
              >
                {{ category.category_name }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- Loading State -->
        <v-row v-if="loading || initializingDb" justify="center" class="my-10">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="red-darken-2" size="64"></v-progress-circular>
            <p class="mt-4">
              {{ initializingDb ? 'Setting up database...' : 'Loading products...' }}
            </p>
          </v-col>
        </v-row>

        <!-- Products Grid -->
        <v-row v-else-if="filteredProducts.length > 0">
          <v-col
            v-for="product in filteredProducts"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="mb-4"
          >
            <v-card height="100%" class="d-flex flex-column product-card" elevation="3">
              <div class="product-image-container">
                <v-img
                  :src="product.image_url"
                  height="220"
                  cover
                  class="product-image bg-grey-lighten-3"
                >
                  <div class="image-overlay d-flex flex-column justify-center align-center">
                    <v-btn
                      color="white"
                      variant="text"
                      class="mb-2 overlay-btn"
                      @click="openDetailsModal(product)"
                    >
                      <v-icon>mdi-eye</v-icon>
                      View Details
                    </v-btn>
                    <v-btn
                      color="red-darken-2"
                      class="overlay-btn"
                      @click="openRentDialog(product)"
                    >
                      <v-icon>mdi-cart</v-icon>
                      Rent Now
                    </v-btn>
                  </div>
                </v-img>
              </div>

              <v-card-item>
                <v-chip size="small" color="red-lighten-4" class="mb-2">
                  {{ getCategoryName(product.category_id) }}
                </v-chip>
                <v-card-title class="text-h6 mb-1 text-truncate">{{
                  product.product_name
                }}</v-card-title>
                <v-card-text class="text-body-2 product-description">
                  {{
                    product.description.length > 80
                      ? product.description.substring(0, 80) + '...'
                      : product.description
                  }}
                </v-card-text>
              </v-card-item>

              <v-card-actions class="mt-auto">
                <v-btn variant="text" color="grey-darken-1" @click="openDetailsModal(product)">
                  Details
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="red-darken-2" variant="elevated" @click="openRentDialog(product)">
                  Rent Now
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- No Products Found -->
        <v-row v-else justify="center" class="my-10">
          <v-col cols="12" md="8" lg="6" class="text-center">
            <v-icon size="64" color="grey">mdi-emoticon-sad-outline</v-icon>
            <h3 class="mt-4 text-h5">No products found</h3>
            <p class="text-body-1 mt-2">
              We couldn't find any products matching your criteria. Try adjusting your filters or
              search terms.
            </p>
            <v-btn
              color="red-darken-2"
              class="mt-4"
              @click="
                () => {
                  selectedCategory = null
                  searchQuery = ''
                }
              "
            >
              Clear Filters
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- Rent Product Dialog -->
      <RentProductDialog
        v-if="selectedProduct"
        v-model:show="showRentDialog"
        :product="selectedProduct"
        @rental-success="handleRentalSuccess"
      />

      <!-- Product Details Modal -->
      <ProductDetailsModal
        v-if="selectedProduct"
        v-model:show="showDetailsModal"
        :product="selectedProduct"
        :category-name="selectedProduct ? getCategoryName(selectedProduct.category_id) : ''"
        @rent="openRentDialog"
      />

      <!-- Rental History Modal -->
      <RentalHistory :key="rentalHistoryKey" v-model:show="showRentalHistory" />
    </template>
  </AppLayout>
</template>

<style scoped>
.product-card {
  transition: transform 0.3s;
  border-radius: 8px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  transition: transform 0.5s;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.overlay-btn {
  margin: 4px;
  transition: transform 0.2s;
}

.overlay-btn:hover {
  transform: scale(1.05);
}

.product-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2; /* Standard property for compatibility */
}
</style>
