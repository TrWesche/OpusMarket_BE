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
} = require("../config/config");

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
        expect(res.body.message).toBe("Registration successful.")
        expect(retrievedPassword[0]).not.toBe(postVariables.password);
    });

    // Test 2 - Missing Required Parameter - Should be Caught by Schema
    // Manual Test Successful 11/09/2020
    test("Registration Fails on Missing Requried Parameter (first_name)", async () => {
        const res = await request(app)
            .post('/api/reg/user')
            .send({
                email: postVariables.email, 
                last_name: postVariables.last_name,
                password: postVariables.password
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Failed");
        expect(res.body.message).toContain("first_name")
    });


    // Test 3 - Password to Short (8 character min length) - Should be Caught by Schema
    // Manual Test Successful 11/09/2020
    test("Registration Fails on Short Password (8 character min)", async () => {
        const res = await request(app)
            .post('/api/reg/user')
            .send({
                email: postVariables.email, 
                first_name: postVariables.first_name,
                last_name: postVariables.last_name,
                password: "short"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Failed");
        expect(res.body.message).toContain("password")
    });


    // Test 4 - Blank First Name String (2 character min length) - Should be Caught by Schema
    // Manual Test Successful 11/09/2020
    test("Registration Fails on Short UserName (2 character min)", async () => {
        const res = await request(app)
            .post('/api/reg/user')
            .send({
                email: postVariables.email, 
                first_name: "",
                last_name: postVariables.last_name,
                password: postVariables.password
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Failed");
        expect(res.body.message).toContain("first_name")
    });


    // Test 5 - Incorrect email format - Should be Caught by Schema
    // Manual Test Successful 11/09/2020
    test("Registration Fails on Short UserName (2 character min)", async () => {
        const res = await request(app)
            .post('/api/reg/user')
            .send({
                email: "thisisnotanemailaddress", 
                first_name: postVariables.first_name,
                last_name: postVariables.last_name,
                password: postVariables.password
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Failed");
        expect(res.body.message).toContain("email")
    });
});


// Merchant Registration
describe("POST /api/reg/merchant", () => {
    const postVariables = {
        email: "NewMerchantEmail@test.com",
        display_name: "NewMerchantDisplayName",
        password: "NewMerchantPassword"
    }

    // Test 1 - Successful Registration (full end-to-end)
    // Cookie Return & json = {"message": "Registration Successful"} - Manual Test 11/09/2020
    test("Can Create a New Merchant", async () => {
        const res = await request(app)
            .post('/api/reg/merchant')
            .send({
                email: postVariables.email, 
                display_name: postVariables.display_name,
                password: postVariables.password
        });

        const retrievedPassword = await db.query(`
            SELECT password FROM merchants
            WHERE merchants.email = $1
        `, [postVariables.email]);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Registration successful.")
        expect(retrievedPassword[0]).not.toBe(postVariables.password);
    }); 

    // Test 2 - Missing Required Parameter - Should be Caught by Schema
    // Manual Test Successful 11/09/2020
    test("Registration fails on missing Required Parameter (display_name)", async () => {
        const res = await request(app)
            .post('/api/reg/merchant')
            .send({
                email: postVariables.email, 
                password: postVariables.password
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Failed");
        expect(res.body.message).toContain("display_name")
    }); 

    // Test 3 - Password to Short (16 character min length) - Should be Caught by Schema
    // Manual Test Successful 11/09/2020
    test("Registration fails on password to short (16 character min length)", async () => {
        const res = await request(app)
            .post('/api/reg/merchant')
            .send({
                email: postVariables.email,
                display_name: postVariables.display_name,
                password: "shortshort"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Failed");
        expect(res.body.message).toContain("password")
    }); 

    // Test 4 - Blank Display Name String (2 character min length) - Should be Caught by Schema
    // Manual Test Successful 11/09/2020
    test("Registration fails on blank display name string (2 character min length)", async () => {
        const res = await request(app)
            .post('/api/reg/merchant')
            .send({
                email: postVariables.email,
                display_name: "",
                password: postVariables.password
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Failed");
        expect(res.body.message).toContain("display_name")
    }); 

    // Test 5 - Incorrect email format - Should be Caught by Schema
    // Manual Test Successful 11/09/2020
    test("Registration fails on bad email format", async () => {
        const res = await request(app)
            .post('/api/reg/merchant')
            .send({
                email: "thisisnotanemailaddress",
                display_name: postVariables.display_name,
                password: postVariables.password
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Failed");
        expect(res.body.message).toContain("email")
    }); 

});


