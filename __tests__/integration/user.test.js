// Supertest.agent? -> Persist cookies

// npm packages
const request = require("supertest");
const jwt = require("jsonwebtoken")

// app imports
const app = require("../../app");
const db = require("../../db");

// model imports
const User = require("../../models/user");

// config imports
const {
    SOURCE_DATA_USER,
    // TEST_DATA,
    beforeAllHook,
    beforeEachHook,
    afterEachHook,
    afterAllHook,
    SOURCE_DATA_MERCHANT,
    TEST_DATA
} = require("./config");

beforeAll(async function () {
    await beforeAllHook();
});

beforeEach(async function () {
    await beforeEachHook(TEST_DATA);
});

afterEach(async function () {
    await afterEachHook();
})

afterAll(async function() {
    await afterAllHook();
});

// Read Route

describe("GET /api/auth/user", () => {
    // Test 1: Successful Read - Note Requires Stored Token
    // Manual Test Success 11/09/2020

    test("Can Read Profile when Authenticated with Cookies", async () => {
        const res = await request(app).get('/api/users/details').set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty("first_name");
        expect(res.body.user).toHaveProperty("last_name");
        expect(res.body.user).toHaveProperty("email");
    })

    // Test 2: Rejection - No Token - Manual Test Success 11/09/2020
    test("Are Rejected on Missing Authentication Cookies", async () => {
        const res = await request(app).get('/api/users/details');

        expect(res.statusCode).toBe(401);
    })

    // Test 3: Rejection - Merchant Cookie Used to Attempt Access
    test("Are Rejected on Invalid Authentication Cookies (Merchant Type Instead of User Type)", async () => {
        const res = await request(app).get('/api/users/details').set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(401);
    })
});


// Update Route

// Test 1: Successful Update Email
// Manual Test Success 11/10/2020

// Test 2: Successful Update Last_Name
// Manual Test Success 11/10/2020

// Test 3: Successful Update Password (How to check this automatically?)
// Manual Test Success 11/10/2020

// Note - Look into how to test separately to reduce repeated tests
// Test 4: Rejection - No Token
// Manual Test Success 11/10/2020

// Note - Look into how to test separately to reduce repeated tests
// Test 5: Rejection - User Mismatch
// Manual Test Success 11/10/2020

// Test 6: Rejection - Duplicate Email - Checked in Model
// Manual Test Success 11/10/2020

// Test 7: Rejection - Password to Short (8char min) - Checked by Schema
// Manual Test Success 11/10/2020

// Test 8: Rejection - First Name to Short (2char min) - Checked by Schema
// Manual Test Success 11/10/2020

// Test 9: Rejection - Last Name to Short (2char min) - Checked by Schema
// Manual Test Success 11/10/2020

// Test 10: Rejection - Email address not of email format - Checked by Schema
// Manual Test Success 11/10/2020


// Delete Route

// Test 1 - Successfully deletes account & removes cookie
// Manual Test Success 11/10/2020

// Test 2 - Rejection - User Mismatch, cannot delete account
// Manual Test Success 11/10/2020

// Logout Route

// Test 1 - Successfully removes cookie
// Manual Test Success 11/10/2020