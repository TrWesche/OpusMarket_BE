// ======================
// ---- CREATE TESTS ----
// ======================

// Create Product
// --------------------------
// Test 1 - Single Product Creation
// Manual Test Success - 11/12/2020

// Test 2 - Multiple Product Creation
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Missing Required Information
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Negative Value for Price
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Min Length Title / Description Violation
// Manual Test Success - 11/12/2020

// Test 6 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020



// Add Product Image
// --------------------------
// Test 1 - Single Product Creation
// Manual Test Success - 11/12/2020

// Test 2 - Multiple Product Creation
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Missing Required Information
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Value outside of Weight Bounds
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Invalid url
// Manual Test Success - 11/12/2020

// Test 6 - Rejection - Alt Text to Short
// Manual Test Success - 11/12/2020

// Test 7 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 8 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020



// Add Product Meta Data
// --------------------------
// Test 1 - Single Meta Creation
// Manual Test Success - 11/12/2020

// Test 2 - Multiple Product Creation
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Missing Required Information
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Name Length to Short (1 char)
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 6 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020



// Add Product Promotion
// --------------------------
// Note: Additional business rules need to be added here to handle cases
// such as only single promotion alowed active and promo price must be less than list price

// Things to consider -> Make this a multiple entry?

// Test 1 - Promotion Creation
// Manual Test Success - 11/12/2020

// Test 2 - Rejection - Missing Required Information
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Negative Promotion Value
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020



// Add Product Coupon
// --------------------------
// Test 1 - Single Coupon Creation
// Manual Test Success - 11/12/2020

// Test 2 - Multiple Coupon Creation
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Missing Required Information
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Code Length to Short (2 char)
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Code Incudes Illegal Characters (Only 0-9 a-Z allowed)
// Note: Might need to change the default message, may be confusing as it returns the RegEx pattern
// Manual Test Success - 11/12/2020

// Test 6 - Rejection - Negative Discount
// Manual Test Success - 11/12/2020

// Test 7 - Rejection - Greather than 100% (1) Discount
// Manual Test Success - 11/12/2020

// Test 8 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 9 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020



// Add Product Modifier
// --------------------------
// Test 1 - Single Modifier Creation
// Manual Test Success - 11/12/2020

// Test 2 - Multiple Product Modifier Creation
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Missing Required Information
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Name Length to Short (1 char)
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 6 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020



// Add Product Review
// --------------------------
// Test 1 - Review Creation
// Manual Test Success - 11/12/2020

// Test 2 - Rejection - Missing Required Information
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Non-Integer Type for Rating
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Rating Out of Bounds (1-5)
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Not a Buying User
// Manual Test Success - 11/12/2020


// ======================
// ----  READ TESTS  ----
// ======================
// Get Product Details
// --------------------------
// Test 1 - Can retrieve full product details
// Manual Test Success - 11/12/2020

// Test 2 - Returns 404 on product not found
// Manual Test Success - 11/12/2020


// Get Catalog
// --------------------------
// Test 1 - Can retrieve product catalogue no search parameters
// Manual Test Success - 11/12/2020

// Test 2 - Can retrieve products by name search string
// Manual Test Success - 11/12/2020

// Test 3 - Can retrieve products by tag data
// Manual Test Success - 11/12/2020

// Test 4 - Can retrieve products by rating data
// Manual Test Success - 11/12/2020

// Test 5 - Can retrieve products with multiple filters
// Manual Test Success - 11/12/2020



// ======================
// ---- UPDATE TESTS ----
// ======================
// Update Product
// --------------------------
// Test 1 - Product Update
// Manual Test Success - 11/12/2020

// Test 2 - Rejection - Negative Value for Price
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Min Length Title / Description Violation
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Incorrect Merchant
// Manual Test Success - 11/12/2020


// Update Product Image
// --------------------------
// Test 1 - Update Image
// Manual Test Success - 11/12/2020

// Test 2 - Rejection - Value outside of Weight Bounds
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Invalid url
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Alt Text to Short
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 6 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020


// Update Product Meta Data
// --------------------------
// Test 1 - Update Meta
// Manual Test Success - 11/12/2020

// Test 2 - Rejection - Name Length to Short (1 char)
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020



// Update Product Promotion
// --------------------------
// Test 1 - Promotion Update
// Manual Test Success - 11/12/2020

// Test 2 - Rejection - Negative Promotion Value
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020



// Update Product Coupon
// --------------------------
// Test 1 - Update Coupon
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Code Length to Short (2 char)
// Manual Test Success - 11/12/2020

// Test 5 - Rejection - Code Incudes Illegal Characters (Only 0-9 a-Z allowed)
// Note: Might need to change the default message, may be confusing as it returns the RegEx pattern
// Manual Test Success - 11/12/2020

// Test 6 - Rejection - Negative Discount
// Manual Test Success - 11/12/2020

// Test 7 - Rejection - Greather than 100% (1) Discount
// Manual Test Success - 11/12/2020

// Test 8 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 9 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020



// Update Product Modifier
// --------------------------
// Test 1 - Update Modifier
// Manual Test Success - 11/12/2020

// Test 2 - Rejection - Name Length to Short (1 char)
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Not a Merchant User
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Not Correct Merchant
// Manual Test Success - 11/12/2020



// Update Product Review
// --------------------------
// Test 1 - Review Update
// Manual Test Success - 11/12/2020

// Test 2 - Rejection - Non-Integer Type for Rating
// Manual Test Success - 11/12/2020

// Test 3 - Rejection - Rating Out of Bounds (1-5)
// Manual Test Success - 11/12/2020

// Test 4 - Rejection - Not a Buying User
// Manual Test Success - 11/12/2020



// ======================
// ---- DELETE TESTS ----
// ======================
// Delete Product



// Delete Product Image



// Delete Product Meta Data



// Delete Product Promotion



// Delete Product Modifier



// Delete Product Coupon



// Delete Product Review

