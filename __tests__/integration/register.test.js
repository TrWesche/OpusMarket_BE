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
    TEST_DATA,
    ADDITIONAL_USERS
} = require("./config");
const { patch } = require("../../app");

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


// User Registration

// Create Route
describe("POST /api/reg/user", () => {
    const postVariables = {
        email: "NewUserEmail@test.com",
        first_name: "NewUserFirstName",
        last_name: "NewUserLastName",
        password: "NewUserPassword"
    }

    // Test 1 - Successful Registration (full end-to-end)
    // Cookie Return & json = {"message": "Registration Successful"} - Manual Test 11/09/2020
    test("Can Create a New User", async () => {
        const res = await request(app)
            .post('/api/reg/user')
            .send({
                email: postVariables.email, 
                first_name: postVariables.first_name,
                last_name: postVariables.last_name,
                password: postVariables.password
        });

        const retrievedPassword = await db.query(`
            SELECT password FROM users
            WHERE users.email = $1
        `, [postVariables.email]);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty("last_name");
        expect(res.body.user.first_name).toBe(postVariables.first_name);
        expect(res.body.user.email).toBe(postVariables.email);
        expect(res.body.user).not.toHaveProperty("password");
        expect(retrievedPassword[0]).not.toBe(postVariables.password);
    });

    // Test 2 - Missing Required Parameter - Should be Caught by Schema
    // Manual Test Successful 11/09/2020

    // Test 3 - Password to Short (8 character min length) - Should be Caught by Schema
    // Manual Test Successful 11/09/2020

    // Test 4 - Blank First Name String (2 character min length) - Should be Caught by Schema
    // Manual Test Successful 11/09/2020

    // Test 5 - Incorrect email format - Should be Caught by Schema
    // Manual Test Successful 11/09/2020

});






// Merchant Registration

// Test 1 - Successful Registration (full end-to-end)
// Cookie Return & json = {"message": "Registration Successful"} - Manual Test 11/09/2020

// Test 2 - Missing Required Parameter - Should be Caught by Schema
// Manual Test Successful 11/09/2020

// Test 3 - Password to Short (8 character min length) - Should be Caught by Schema
// Manual Test Successful 11/09/2020

// Test 4 - Blank Display Name String (2 character min length) - Should be Caught by Schema
// Manual Test Successful 11/09/2020

// Test 5 - Incorrect email format - Should be Caught by Schema
// Manual Test Successful 11/09/2020
