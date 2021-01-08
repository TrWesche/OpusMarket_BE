// process.env.NODE_ENV = "test";

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
    TEST_DATA,
    beforeAllHook,
    beforeEachHook,
    afterEachHook,
    afterAllHook,
    SOURCE_DATA_MERCHANT
} = require("./config")



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


// User Authentication   
describe("POST /api/auth/user", () => {
    // Test 1 - Successful Authentication (full end-to-end)
    // Cookie Return & json = {"message": "Login successful"} - Manual Test Successful - 11/09/2020
    test("Can Login", async () => {
        const res = await request(app).post('/api/auth/user').send({email: SOURCE_DATA_USER.testUser.email, password: SOURCE_DATA_USER.testUser.password});

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful.");
    })

    // Test 2 - Missing Required Parameter - Should be Caught by Schema
    // Manual Test Successful - 11/09/2020
    test("Fails Login on Missing  Username/Password", async () => {
        const res = await request(app).post('/api/auth/user').send({password: SOURCE_DATA_USER.testUser.password});
        expect(res.statusCode).toBe(400);
    })

    // Test 3 - Incorrect Password - Should be caught by model
    // Manual Test Successful - 11/09/2020
    test("Fails Login on Incorrect Username/Password Combination", async () => {
        const res = await request(app).post('/api/auth/user').send({email: SOURCE_DATA_USER.testUser.email, password: "wrongpassword"});
        expect(res.statusCode).toBe(401);
    })

    // Test 4 - Incorrect email format - Should be Caught by Schema
    // Manual Test Successful - 11/09/2020
    test("Fails Login on Incorrect Email Format", async () => {
        const res = await request(app).post('/api/auth/user').send({email: "MrStaticShock@test", password: SOURCE_DATA_USER.testUser.password});
        expect(res.statusCode).toBe(400);
    })
});


// Merchant Authentication
describe("POST /api/auth/merchant", () => {
    // Test 1 - Successful Authentication (full end-to-end)
    // Cookie Return & json = {"message": "Login successful"} - Manual Test Successful - 11/09/2020
    test("Can Login", async () => {
        const res = await request(app).post('/api/auth/merchant').send({email: SOURCE_DATA_MERCHANT.testMerchant.email, password: SOURCE_DATA_MERCHANT.testMerchant.password});

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login successful.");
    })

    // Test 2 - Missing Required Parameter - Should be Caught by Schema
    // Manual Test Successful - 11/09/2020
    test("Fails Login on Missing  Username/Password", async () => {
        const res = await request(app).post('/api/auth/merchant').send({password: SOURCE_DATA_MERCHANT.testMerchant.password});
        expect(res.statusCode).toBe(400);
    })

    // Test 3 - Incorrect Password - Should be caught by model
    // Manual Test Successful - 11/09/2020
    test("Fails Login on Incorrect Username/Password Combination", async () => {
        const res = await request(app).post('/api/auth/merchant').send({email: SOURCE_DATA_MERCHANT.testMerchant.email, password: "wrongpassword"});
        expect(res.statusCode).toBe(401);
    })

    // Test 4 - Incorrect email format - Should be Caught by Schema
    // Manual Test Successful - 11/09/2020
    test("Fails Login on Incorrect Email Format", async () => {
        const res = await request(app).post('/api/auth/merchant').send({email: "MrStaticShock@test", password: SOURCE_DATA_MERCHANT.testMerchant.password});
        expect(res.statusCode).toBe(400);
    })
});