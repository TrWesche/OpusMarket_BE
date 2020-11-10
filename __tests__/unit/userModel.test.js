// Register

// Test 1 - Duplicate User Email - Should be Caught by Model Query
// Manual Test Successful 11/09/2020

// Test 2 - Password Should be Encrypted -> password in !== password out
// Not officially tested, data in PSQL db has been encrypted - 11/09/2020
// Have to consider how to do this, the model will not return the encrypted password from the query.

// Test 3 - Should return a user object containing {id, first_name, and a type set to "user"}
// Not Tested