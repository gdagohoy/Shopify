import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from '@/stores/authUser'

export const useRentalsStore = defineStore('rentals', () => {
  // Get auth store
  const authStore = useAuthUserStore()
  
  // State
  const rentals = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Fetch user's rentals from Supabase
  const fetchUserRentals = async () => {
    if (!authStore.user) return
    
    isLoading.value = true
    error.value = null
    
    try {
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
        .eq('renter_id', authStore.user.id)
        .order('created_at', { ascending: false })
      
      if (rentalsError) throw rentalsError
      
      rentals.value = data || []
    } catch (err) {
      console.error('Error fetching rentals:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Create a new rental
  const createRental = async (productId, returnDate) => {
    if (!authStore.user) throw new Error('User must be logged in to rent products')
    
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: rentalError } = await supabase
        .from('rentals')
        .insert({
          renter_id: authStore.user.id,
          product_id: productId,
          rent_date: new Date().toISOString(),
          return_date: returnDate,
          rental_status: 'active',
          created_at: new Date().toISOString()
        })
        .select()
      
      if (rentalError) throw rentalError
      
      // Refresh rentals list
      await fetchUserRentals()
      
      return data[0]
    } catch (err) {
      console.error('Error creating rental:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update rental status (e.g., mark as returned)
  const updateRentalStatus = async (rentalId, status) => {
    if (!authStore.user) throw new Error('User must be logged in to update rentals')
    
    isLoading.value = true
    error.value = null
    
    try {
      const { data, error: updateError } = await supabase
        .from('rentals')
        .update({ 
          rental_status: status,
          ...(status === 'returned' ? { return_date: new Date().toISOString() } : {})
        })
        .eq('id', rentalId)
        .eq('renter_id', authStore.user.id) // Security check
        .select()
      
      if (updateError) throw updateError
      
      // Refresh rentals list
      await fetchUserRentals()
      
      return data[0]
    } catch (err) {
      console.error('Error updating rental:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Computed properties
  const activeRentals = computed(() => {
    return rentals.value.filter(rental => rental.rental_status === 'active')
  })

  const pastRentals = computed(() => {
    return rentals.value.filter(rental => rental.rental_status === 'returned')
  })

  return {
    rentals,
    isLoading,
    error,
    activeRentals,
    pastRentals,
    fetchUserRentals,
    createRental,
    updateRentalStatus
  }
})
