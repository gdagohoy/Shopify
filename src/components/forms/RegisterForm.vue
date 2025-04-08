<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')

const register = () => {
  console.log('Registering user:', {
    email: email.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
  })
}
</script>

<template>
  <v-form @submit.prevent="register">
    <v-text-field
      v-model="firstName"
      label="First Name"
      required
      prepend-icon="mdi-account"
    ></v-text-field>

    <v-text-field
      v-model="lastName"
      label="Last Name"
      required
      prepend-icon="mdi-account"
    ></v-text-field>

    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      required
      prepend-icon="mdi-email"
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      required
      prepend-icon="mdi-lock"
    ></v-text-field>

    <v-text-field
      v-model="confirmPassword"
      label="Confirm Password"
      type="password"
      required
      prepend-icon="mdi-lock-check"
    ></v-text-field>

    <v-btn color="red-darken-2" block class="mt-4" type="submit"> Register </v-btn>
  </v-form>
</template>
