<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from '@/stores/authUser'
import { formActionDefault } from '@/utils/supabase'
import AlertNotification from '@/components/common/AlertNotification.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'rental-success'])

// Use auth store
const authStore = useAuthUserStore()

// Form state
const rentalDays = ref(1)
const returnDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + rentalDays.value)
  return date.toISOString().split('T')[0]
})

// Form action state
const formAction = ref({
  ...formActionDefault
})

// Loading state
const isSubmitting = ref(false)
const isAuthenticated = ref(false)

// Check authentication status on mount
onMounted(async () => {
  isAuthenticated.value = await authStore.isAuthenticated()
})

// Methods
const closeDialog = () => {
  emit('update:show', false)
  rentalDays.value = 1
  formAction.value = { ...formActionDefault }
}

const submitRental = async () => {
  // Re-check authentication status before submitting
  isAuthenticated.value = await authStore.isAuthenticated()
  
  if (!isAuthenticated.value) {
    formAction.value.formErrorMessage = 'You must be logged in to rent products'
    return
  }

  isSubmitting.value = true
  formAction.value = { ...formActionDefault, formProcess: true }

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('You must be logged in to rent products')
    }

    // Create rental record in database
    const { data, error } = await supabase
      .from('rentals')
      .insert({
        renter_id: user.id,
        product_id: props.product.id,
        rent_date: new Date().toISOString(),
        return_date: new Date(returnDate.value).toISOString(),
        rental_status: 'active',
        created_at: new Date().toISOString()
      })
      .select()

    if (error) throw error

    // Success
    formAction.value.formSuccessMessage = `Successfully rented ${props.product.product_name}!`
    
    // Emit success event
    setTimeout(() => {
      emit('rental-success', data[0])
      closeDialog()
    }, 2000)
  } catch (error) {
    console.error('Error creating rental:', error)
    formAction.value.formErrorMessage = error.message || 'Failed to create rental'
  } finally {
    isSubmitting.value = false
    formAction.value.formProcess = false
  }
}
</script>

<template>
  <v-dialog
    v-model="props.show"
    max-width="500px"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title class="text-h5 bg-red-darken-2 text-white pa-4">
        Rent {{ product.product_name }}
      </v-card-title>
      
      <v-card-text class="pa-4">
        <AlertNotification
          :formSuccessMessage="formAction.formSuccessMessage"
          :formErrorMessage="formAction.formErrorMessage"
        />

        <v-row v-if="!isAuthenticated" class="mt-2">
          <v-col cols="12" class="text-center">
            <v-alert
              type="warning"
              variant="tonal"
              title="Authentication Required"
              text="You must be logged in to rent products"
            ></v-alert>
            <v-btn
              color="red-darken-2"
              class="mt-4"
              to="/login"
              @click="closeDialog"
            >
              Go to Login
            </v-btn>
          </v-col>
        </v-row>

        <template v-else>
          <v-row class="mt-2">
            <v-col cols="12">
              <v-img
                :src="product.image_url"
                height="200"
                class="rounded-lg"
                cover
              ></v-img>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3 class="text-h6">{{ product.product_name }}</h3>
              <p class="text-body-2 mt-2">{{ product.description }}</p>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">Rental Details</h3>
            </v-col>
            <v-col cols="12">
              <v-slider
                v-model="rentalDays"
                :min="1"
                :max="30"
                :step="1"
                thumb-label
                label="Rental Duration (Days)"
                color="red-darken-2"
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="rentalDays"
                    type="number"
                    style="width: 70px"
                    density="compact"
                    hide-details
                    variant="outlined"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Rental Start Date"
                :model-value="new Date().toISOString().split('T')[0]"
                readonly
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-calendar-today"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Return Date"
                :model-value="returnDate"
                readonly
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-calendar-check"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
          :disabled="isSubmitting"
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="isAuthenticated"
          color="red-darken-2"
          variant="elevated"
          @click="submitRental"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Confirm Rental
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
