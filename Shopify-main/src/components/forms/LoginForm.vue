<script setup>
import { requiredValidator, emailValidator } from '@/utils/validator'
import { ref } from 'vue'

const isPasswordVisible = ref(false)
const refvform = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const onLogin = () => {
  alert(formData.value.email)
}

const onFormSubmit = () => {
  refvform.value?.validate().then(({ valid }) => {
    if (valid) onLogin()
  })
}
</script>

<template>
  <v-form ref="refvform" @submit.prevent="onFormSubmit">
    <v-text-field
      v-model="formData.email"
      label="Email"
      type="email"
      required
      prepend-icon="mdi-email"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      :type="isPasswordVisible ? 'text' : 'password'"
      label="Password"
      required
      prepend-icon="mdi-lock"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator]"
    ></v-text-field>

    <v-btn color="red-darken-2" type="submit" block class="mt-4"> Login </v-btn>
  </v-form>
</template>
