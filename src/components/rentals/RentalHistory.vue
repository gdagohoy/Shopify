<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from '@/stores/authUser'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:show'])

// Use auth store
const authStore = useAuthUserStore()

// State
const rentals = ref([])
const loading = ref(false)
const error = ref(null)
const activeTab = ref(0)

// Computed
const activeRentals = computed(() => {
  return rentals.value.filter(rental => rental.rental_status === 'active')
})

const pastRentals = computed(() => {
  return rentals.value.filter(rental => rental.rental_status === 'returned')
})

// Methods
const closeModal = () => {
  emit('update:show', false)
}

const fetchRentals = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('User not authenticated')
      return
    }
    
    const { data, error: rentalsError } = await supabase
      .from('rentals')
      .select(`
        *,
        products:product_id (
          id,
          product_name,
          description,
          image_url,
          category_id
        )
      `)
      .eq('renter_id', user.id)
      .order('created_at', { ascending: false })
    
    if (rentalsError) throw rentalsError
    
    rentals.value = data || []
    console.log('Fetched rentals:', rentals.value)
  } catch (err) {
    console.error('Error fetching rentals:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const returnRental = async (rentalId) => {
  try {
    const { error: updateError } = await supabase
      .from('rentals')
      .update({ 
        rental_status: 'returned',
        return_date: new Date().toISOString()
      })
      .eq('id', rentalId)
    
    if (updateError) throw updateError
    
    // Refresh rentals list
    await fetchRentals()
  } catch (err) {
    console.error('Error returning rental:', err)
    error.value = err.message
  }
}

// Watch for show prop changes
watch(() => props.show, (newValue) => {
  if (newValue) {
    fetchRentals()
  }
}, { immediate: true })

// Load rentals when component mounts
onMounted(() => {
  if (props.show) {
    fetchRentals()
  }
})
</script>

<template>
  <v-dialog
    v-model="props.show"
    max-width="900px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title class="text-h5 bg-red-darken-2 text-white pa-4">
        Your Rental History
      </v-card-title>
      
      <v-card-text class="pa-4">
        <v-tabs
          v-model="activeTab"
          color="red-darken-2"
          align-tabs="center"
        >
          <v-tab :value="0">Active Rentals ({{ activeRentals.length }})</v-tab>
          <v-tab :value="1">Past Rentals ({{ pastRentals.length }})</v-tab>
        </v-tabs>
        
        <v-window v-model="activeTab" class="mt-4">
          <!-- Active Rentals Tab -->
          <v-window-item :value="0">
            <div v-if="loading" class="text-center py-4">
              <v-progress-circular indeterminate color="red-darken-2"></v-progress-circular>
              <p class="mt-2">Loading your rentals...</p>
            </div>
            
            <div v-else-if="activeRentals.length === 0" class="text-center py-6">
              <v-icon size="64" color="grey-lighten-1">mdi-cart-outline</v-icon>
              <h3 class="mt-4">No active rentals</h3>
              <p class="text-body-2 mt-2">You don't have any active rentals at the moment.</p>
            </div>
            
            <v-table v-else>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Rent Date</th>
                  <th>Return Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rental in activeRentals" :key="rental.id">
                  <td class="d-flex align-center">
                    <v-avatar size="40" class="mr-2">
                      <v-img :src="rental.products?.image_url" cover></v-img>
                    </v-avatar>
                    <span>{{ rental.products?.product_name }}</span>
                  </td>
                  <td>{{ formatDate(rental.rent_date) }}</td>
                  <td>{{ formatDate(rental.return_date) }}</td>
                  <td>
                    <v-btn
                      color="green"
                      size="small"
                      variant="text"
                      @click="returnRental(rental.id)"
                    >
                      Return Now
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
          
          <!-- Past Rentals Tab -->
          <v-window-item :value="1">
            <div v-if="loading" class="text-center py-4">
              <v-progress-circular indeterminate color="red-darken-2"></v-progress-circular>
              <p class="mt-2">Loading your rental history...</p>
            </div>
            
            <div v-else-if="pastRentals.length === 0" class="text-center py-6">
              <v-icon size="64" color="grey-lighten-1">mdi-history</v-icon>
              <h3 class="mt-4">No rental history</h3>
              <p class="text-body-2 mt-2">You don't have any past rentals.</p>
            </div>
            
            <v-table v-else>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Rent Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rental in pastRentals" :key="rental.id">
                  <td class="d-flex align-center">
                    <v-avatar size="40" class="mr-2">
                      <v-img :src="rental.products?.image_url" cover></v-img>
                    </v-avatar>
                    <span>{{ rental.products?.product_name }}</span>
                  </td>
                  <td>{{ formatDate(rental.rent_date) }}</td>
                  <td>{{ formatDate(rental.return_date) }}</td>
                  <td>
                    <v-chip
                      size="small"
                      color="green-lighten-4"
                      text-color="green-darken-2"
                    >
                      Returned
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
        </v-window>
      </v-card-text>
      
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="red-darken-2"
          variant="text"
          @click="fetchRentals"
          class="mr-2"
        >
          <v-icon start>mdi-refresh</v-icon>
          Refresh
        </v-btn>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeModal"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
