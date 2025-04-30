<script setup>
import { requiredValidator, emailValidator, passwordValidator } from '@/utils/validator'
import { ref } from 'vue'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

const register = () => {
  console.log('Registering user:', {
    email: email.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
  })
}

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const refvform = ref()
</script>

<template>
  <v-form @submit.prevent="register">
    <v-text-field
      v-model="firstName"
      label="First Name"
      required
      prepend-icon="mdi-account"
      :rules="[requiredValidator]"
    ></v-text-field>

    <v-text-field
      v-model="lastName"
      label="Last Name"
      required
      prepend-icon="mdi-account"
      :rules="[requiredValidator]"
    ></v-text-field>

    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      required
      prepend-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Password"
      :type="isPasswordVisible ? 'text' : 'password'"
      required
      prepend-icon="mdi-lock"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator, passwordValidator]"
    ></v-text-field>

    <v-text-field
      v-model="password_confirmation"
      label="Password Confirmation"
      :type="isPasswordConfirmVisible ? 'text' : 'password'"
      required
      prepend-icon="mdi-lock-check"
      :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
      :rules="[requiredValidator, confirmedValidator]"
    ></v-text-field>

    <v-btn color="red-darken-2" block class="mt-4" type="submit"> Register </v-btn>
  </v-form>
</template>
