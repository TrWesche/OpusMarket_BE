// Read Route

// Test 1: Successful Read - Note Requires Stored Token
// Manual Test 

// Note - Look into how to test separately to reduce repeated tests
// Test 2: Rejection - No Token - Manual Test 

// Note - Look into how to test separately to reduce repeated tests
// Test 3: Rejection - User Mismatch - Manual Test 

// Note - Look into how to test separately to reduce repeated tests
// Test 4: Rejection - Reject on Attempt to Access Merchant with Same ID - Manual Test 



// Update Route

// Test 1: Successful Update email
// Manual Test 

// Test 2: Successful Update display_name
// Manual Test 

// Test 3: Successful Update Password (How to check this automatically?)
// Manual Test 

// Note - Look into how to test separately to reduce repeated tests
// Test 4: Rejection - No Token
// Manual Test 

// Note - Look into how to test separately to reduce repeated tests
// Test 5: Rejection - User Mismatch
// Manual Test 

// Test 6: Rejection - Duplicate Email - Checked in Model
// Manual Test 

// Test 7: Rejection - Password to Short (8char min) - Checked by Schema
// Manual Test

// Test 8: Rejection - First Name to Short (2char min) - Checked by Schema
// Manual Test

// Test 9: Rejection - Last Name to Short (2char min) - Checked by Schema
// Manual Test

// Test 10: Rejection - Email address not of email format - Checked by Schema
// Manual Test 


// Delete Route

// Test 1 - Successfully deletes account & removes cookie
// Manual Test

// Test 2 - Rejection - User Mismatch, cannot delete account
// Manual Test

// Logout Route

// Test 1 - Successfully removes cookie
// Manual Test