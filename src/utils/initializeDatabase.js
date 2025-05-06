import { supabase } from './supabase'
import { products as initialProducts } from '@/components/common/productsList'

/**
 * Initialize the database with categories and products from the local data
 * This should be called once when the app starts
 */
export const initializeDatabase = async () => {
  console.log('Initializing database with products and categories...')
  
  try {
    // Step 1: Extract unique categories from products list
    const uniqueCategories = [...new Set(initialProducts.map(product => product.catergory))]
    const categories = uniqueCategories.map((name, index) => ({
      id: index + 1,
      category_name: name,
      created_at: new Date().toISOString()
    }))
    
    // Step 2: Check if categories already exist in the database
    const { data: existingCategories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
    
    if (categoriesError) {
      console.error('Error checking categories:', categoriesError)
      return
    }
    
    // Step 3: Insert categories if they don't exist
    if (!existingCategories || existingCategories.length === 0) {
      console.log('Adding categories to database...')
      const { error: insertCategoriesError } = await supabase
        .from('categories')
        .insert(categories)
      
      if (insertCategoriesError) {
        console.error('Error inserting categories:', insertCategoriesError)
        return
      }
      
      console.log(`Added ${categories.length} categories to database`)
    } else {
      console.log('Categories already exist in database')
    }
    
    // Step 4: Check if products already exist in the database
    const { data: existingProducts, error: productsError } = await supabase
      .from('products')
      .select('*')
    
    if (productsError) {
      console.error('Error checking products:', productsError)
      return
    }
    
    // Step 5: Insert products if they don't exist
    if (!existingProducts || existingProducts.length === 0) {
      console.log('Adding products to database...')
      
      // Get current user for user_id field
      const { data: { user } } = await supabase.auth.getUser()
      
      // Map products to database structure
      const productsToInsert = initialProducts.map((product, index) => {
        const categoryObj = categories.find(cat => cat.category_name === product.catergory)
        return {
          id: crypto.randomUUID(), // Generate UUID for each product
          product_name: product.product_name,
          description: product.description,
          image_url: product.image,
          category_id: categoryObj ? categoryObj.id : null,
          created_at: new Date().toISOString(),
          user_id: user ? user.id : null // Set current user as owner if available
        }
      })
      
      // Insert products in batches to avoid payload size limits
      const batchSize = 10
      for (let i = 0; i < productsToInsert.length; i += batchSize) {
        const batch = productsToInsert.slice(i, i + batchSize)
        const { error: insertProductsError } = await supabase
          .from('products')
          .insert(batch)
        
        if (insertProductsError) {
          console.error(`Error inserting products batch ${i/batchSize + 1}:`, insertProductsError)
        }
      }
      
      console.log(`Added ${productsToInsert.length} products to database`)
    } else {
      console.log('Products already exist in database')
    }
    
    console.log('Database initialization complete')
    return true
  } catch (error) {
    console.error('Error initializing database:', error)
    return false
  }
}
