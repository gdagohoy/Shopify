<script setup>
import { ref } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  },
  categoryName: {
    type: String,
    default: 'Unknown'
  }
})

const emit = defineEmits(['update:show', 'rent'])

const closeModal = () => {
  emit('update:show', false)
}

const rentProduct = () => {
  emit('rent', props.product)
  closeModal()
}
</script>

<template>
  <v-dialog
    v-model="props.show"
    max-width="800px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title class="text-h5 bg-red-darken-2 text-white pa-4">
        {{ product.product_name }}
      </v-card-title>
      
      <v-card-text class="pa-0">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-img
              :src="product.image_url"
              height="400"
              cover
              class="h-100"
            ></v-img>
          </v-col>
          
          <v-col cols="12" md="6" class="pa-6">
            <v-chip
              size="small"
              color="red-lighten-4"
              class="mb-3"
            >
              {{ categoryName }}
            </v-chip>
            
            <h2 class="text-h4 mb-3">{{ product.product_name }}</h2>
            
            <v-divider class="mb-4"></v-divider>
            
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Description</h3>
            <p class="text-body-1 mb-6">{{ product.description }}</p>
            
            <v-divider class="mb-4"></v-divider>
            
            <v-row>
              <v-col cols="12">
                <v-btn
                  color="red-darken-2"
                  variant="elevated"
                  block
                  size="large"
                  @click="rentProduct"
                >
                  <v-icon start>mdi-cart</v-icon>
                  Rent Now
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
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
