import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { products as initialProducts } from '@/components/common/productsList'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref([])
  const categories = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Get unique categories from productsList.js
  const initializeCategories = () => {
    const uniqueCategories = [...new Set(initialProducts.map(product => product.catergory))]
    categories.value = uniqueCategories.map((name, index) => ({
      id: index + 1,
      category_name: name,
      created_at: new Date().toISOString()
    }))
  }

  // Initialize products from productsList.js with proper structure
  const initializeProducts = () => {
    products.value = initialProducts.map((product, index) => {
      const categoryObj = categories.value.find(cat => cat.category_name === product.catergory)
      return {
        id: `temp-${index}`,
        product_name: product.product_name,
        description: product.description,
        image_url: product.image,
        category_id: categoryObj ? categoryObj.id : null,
        created_at: new Date().toISOString(),
        user_id: null // Will be set when fetching from database
      }
    })
  }

  // Fetch products from Supabase
  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
      
      if (productsError) throw productsError
      
      if (productsData && productsData.length > 0) {
        products.value = productsData
      } else {
        // If no products in database, initialize from local data
        initializeCategories()
        initializeProducts()
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      error.value = err.message
      // Fallback to local data
      initializeCategories()
      initializeProducts()
    } finally {
      isLoading.value = false
    }
  }

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
      
      if (categoriesError) throw categoriesError
      
      if (categoriesData && categoriesData.length > 0) {
        categories.value = categoriesData
      } else {
        // If no categories in database, initialize from local data
        initializeCategories()
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      // Fallback to local data
      initializeCategories()
    }
  }

  // Get products by category
  const getProductsByCategory = (categoryId) => {
    return computed(() => {
      return products.value.filter(product => product.category_id === categoryId)
    })
  }

  // Get all categories
  const getAllCategories = computed(() => categories.value)

  // Get all products
  const getAllProducts = computed(() => products.value)

  return {
    products,
    categories,
    isLoading,
    error,
    fetchProducts,
    fetchCategories,
    getProductsByCategory,
    getAllCategories,
    getAllProducts
  }
})
