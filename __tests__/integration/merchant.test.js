// Read Route

// Test 1: Successful Read - Note Requires Stored Token
// Manual Test Success 11/10/2020

// Note - Look into how to test separately to reduce repeated tests
// Test 2: Rejection - No Token - Manual Test Success 11/10/2020

// Note - Look into how to test separately to reduce repeated tests
// Test 3: Rejection - User Mismatch - Manual Test Success 11/10/2020

// Note - Look into how to test separately to reduce repeated tests
// Test 4: Rejection - Reject on Attempt to Access user with Same ID - Manual Test Success 11/10/2020



// Update Route

// Test 1: Successful Update email
// Manual Test Successful 11/10/2020

// Test 2: Successful Update display_name
// Manual Test Successful 11/10/2020

// Test 3: Successful Update Password (How to check this automatically?)
// Manual Test Successful 11/10/2020

// Note - Look into how to test separately to reduce repeated tests
// Test 4: Rejection - No Token
// Manual Test Successful 11/10/2020

// Note - Look into how to test separately to reduce repeated tests
// Test 5: Rejection - User Mismatch
// Manual Test Successful 11/10/2020

// Test 6: Rejection - Duplicate Email - Checked in Model
// Manual Test Successful 11/10/2020

// Test 7: Rejection - Password to Short (16char min) - Checked by Schema
// Manual Test Successful 11/10/2020

// Test 8: Rejection - Display Name to Short (2char min) - Checked by Schema
// Manual Test Successful 11/10/2020

// Test 9: Rejection - Email address not of email format - Checked by Schema
// Manual Test Successful 11/10/2020



// Delete Route

// Test 1 - Successfully deletes account & removes cookie
// Manual Test Successful 11/10/2020
 
// Test 2 - Rejection - User Mismatch, cannot delete account
// Manual Test Successful 11/10/2020



// Logout Route

// Test 1 - Successfully removes cookie
// Manual Test Successful 11/10/2020