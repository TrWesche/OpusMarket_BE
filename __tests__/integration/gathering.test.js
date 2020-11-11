// Create Gathering

// Test 1 - Successful Creation
// Manual Test Successful 11/10/2020

// Test 2 - Reject on Empty Title
// Manual Test - Successful 11/10/2020

// Test 3 - Reject on Incorrect Date/Time Stamp
// Manual Test - Successful 11/10/2020

// Test 4 - Reject on Missing User Token
// Manual Test - Successful 11/10/2020

// Test 5 - Reject on Non-Merchant Token
// Manual Test - Successful 11/10/2020



// Add Gathering Merchants

// Test 1 - Successful Addition of a Single Merchant
// Manual Test - Successful 11/10/2020

// Test 2 - Successful Addition of Multiple Merchants
// Manual Test - Successful 11/10/2020

// Test 3 - Reject on non-integer merchant ID
// Manual Test - Successful 11/10/2020

// Test 4 - Fail on Non-Existent Merchant ID
// Manual Test - Successful 11/10/2020
// Note - May want to change the error message

// Test 5 - Fail on Missing User Token
// Not Tested - Same Logic as Create utilizing middleware "ensureIsMerchant"

// Test 6 - Reject on Non-Merchant Token
// Not Tested - Same Logic as Create utilizing middleware "ensureIsMerchant"


// Add Gathering Images

// Test 1 - Successful Addition of a Single Image
// Manual Test - Successful 11/10/2020

// Test 2 - Successful Addition of Multiple Images
// Manual Test - Successful 11/10/2020

// Test 3 - Reject on non-uri image link
// Manual Test - Successful 11/10/2020

// Test 4 - Fail on Missing User Token
// Not Tested - Same Logic as Create utilizing middleware "ensureIsMerchant"

// Test 5 - Reject on Non-Merchant Token
// Not Tested - Same Logic as Create utilizing middleware "ensureIsMerchant"

// Test 6 - Fail on Non-Existent Gathering
// Manual Test - Successful 11/10/2020


// Get Gathering Details

// Test 1 - Successful Retrieval of an Existing Gathering
// Manual Test - Successful 11/10/2020

// Test 2 - Reject on Non-Existing Gathering
// Manual Test - Successful 11/10/2020



// Get Merchant Gatherings

// Test 1 - Successful Retrieval of Merchant Gatherings (where they exist)
// Manual Test - Successful 11/10/2020

// Test 2 - Successful Retrievel of Merchant Gatherings (where there are none)
// Manual Test - Successful 11/10/2020