<script setup></script>

<template>
  <v-form>
    <v-text-field label="Email" type="email" required prepend-icon="mdi-email"></v-text-field>
    <v-text-field label="Password" type="password" required prepend-icon="mdi-lock"></v-text-field>
    <v-btn color="red-darken-2" block class="mt-4"> Login </v-btn>
  </v-form>
</template>
