import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

export const useAuthUserStore = defineStore('authUser', () => {
  // States
  const userData = ref(null)

  // Getters
  // Computed Properties; Use for getting the state but not modifying its reactive state

  // Reset State Action
  function $reset() {
    userData.value = null
  }

  // Actions
  // Retrieve User Session if Logged
  async function isAuthenticated() {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session:', error.message)
      return false
    }

    if (data.session) {
      const { id, email, user_metadata } = data.session.user
      userData.value = { id, email, ...user_metadata }
    }

    return !!data.session
  }

  // Retrieve User Information
  async function getUserInformation() {
    const {
      data: {
        // Retrieve Id, Email and Metadata thru Destructuring
        user: { id, email, user_metadata },
      },
    } = await supabase.auth.getUser()

    // Set the retrieved information to state
    userData.value = { id, email, ...user_metadata }
  }

  // Update User Information
  async function updateUserInformation(updatedData) {
    const {
      data: {
        // Retrieve Id, Email and Metadata thru Destructuring
        user: { id, email, user_metadata },
      },
      error,
    } = await supabase.auth.updateUser({
      data: {
        ...updatedData,
      },
    })

    // Check if it has error
    if (error) {
      return { error }
    }
    // If no error set updatedData to userData state
    else if (user_metadata) {
      userData.value = { id, email, ...user_metadata }

      return { data: userData.value }
    }
  }

  // Update User Profile Image
  //   async function updateUserImage(file) {
  // Get the file extension from the uploaded file
  // const fileExtension = file.name.split('.').pop()

  // Upload the file with the user ID and file extension
  // const { data, error } = await supabase.storage
  //   .from('shirlix')
  //   .upload('avatars/' + userData.value.id + '-avatar.png', file, {
  //     cacheControl: '3600',
  //     upsert: true,
  //   })

  // Check if it has error
  // if (error) {
  //   return { error }
  // }
  // If no error set data to userData state with the image_url
  // else if (data) {
  // Retrieve Image Public Url
  //   const { data: imageData } = supabase.storage.from('shirlix').getPublicUrl(data.path)

  // Update the user information with the new image_url
  //   return await updateUserInformation({ ...userData.value, image_url: imageData.publicUrl })
  //     }
  //   }

  return {
    userData,
    $reset,
    isAuthenticated,
    getUserInformation,
    updateUserInformation,
  }
})
