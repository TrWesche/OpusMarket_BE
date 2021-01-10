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


// Read Route
describe("GET /api/users/details", () => {
    // Test 1: Successful Read - Note Requires Stored Token
    // Manual Test Success 11/09/2020
    test("Can Read Profile when Authenticated with Cookies", async () => {
        const res = await request(app).get('/api/users/details').set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty("first_name");
        expect(res.body.user).toHaveProperty("last_name");
        expect(res.body.user).toHaveProperty("email");
        expect(res.body.user).not.toHaveProperty("password");
    });

    // Test 2: Rejection - No Token - Manual Test Success 11/09/2020
    test("Are Rejected on Missing Authentication Cookies", async () => {
        const res = await request(app).get('/api/users/details');

        expect(res.statusCode).toBe(401);
    });

    // Test 3: Rejection - Merchant Cookie Used to Attempt Access
    test("Are Rejected on Invalid Authentication Cookies (Merchant Type Instead of User Type)", async () => {
        const res = await request(app).get('/api/users/details').set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(401);
    });
});


// Update Route
describe("PATCH /api/users/update", () => {
    const patchVariables = {
        email: "AlteredEmail@test.com",
        first_name: "AlteredFirstName",
        password: "AlteredPassword"
    }

    // Test 1: Successful Update Email & First Name
    // Manual Test Success 11/10/2020
    test("Can Update Email & First Name when Authenticated with Cookies", async () => {
        const res = await request(app)
            .patch('/api/users/update')
            .set("Cookie", TEST_DATA.userCookies)
            .send({email: patchVariables.email, first_name: patchVariables.first_name});

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty("last_name");
        expect(res.body.user.first_name).toBe(patchVariables.first_name);
        expect(res.body.user.email).toBe(patchVariables.email);
        expect(res.body.user).not.toHaveProperty("password");
    });

    
    // Test 2: Successful Update Password (How to check this automatically?)
    // Manual Test Success 11/10/2020
    test("Can Update Password when Authenticated with Cookies", async () => {
        const oldPassword = await db.query(`
            SELECT password FROM users
            WHERE users.id = $1
        `, [TEST_DATA.userDetails.id]);

        const res = await request(app)
            .patch('/api/users/update')
            .set("Cookie", TEST_DATA.userCookies)
            .send({password: patchVariables.password});

        const newPassword = await db.query(`
            SELECT password FROM users
            WHERE users.id = $1
        `, [TEST_DATA.userDetails.id]);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty("last_name");
        expect(res.body.user).not.toHaveProperty("password");
        expect(newPassword).not.toBe(patchVariables.password);
        expect(newPassword).not.toBe(oldPassword);
    });

    // Test 3: Rejection - No Authentication Cookies
    // Manual Test Success 11/10/2020
    test("Are Rejected with Unauthorized when Authentication not Present", async () => {
        const res = await request(app)
            .patch('/api/users/update')
            .send({password: patchVariables.password});

        expect(res.statusCode).toBe(401);
    });

    // Test 4: Rejection - Duplicate Email - Checked in Model
    // Manual Test Success 11/10/2020
    test("Are Rejected when attempting update with a duplicate email address", async () => {
        const res = await request(app)
            .patch('/api/users/update')
            .set("Cookie", TEST_DATA.userCookies)
            .send({email: ADDITIONAL_USERS.testUser2.email});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("A user already exists with that email");
    });

    // Test 5: Rejection - Password to Short (8char min) - Checked by Schema
    // Manual Test Success 11/10/2020
    test("Are Rejected when attempting to update password when password violates minimum length (8chars)", async () => {
        const res = await request(app)
            .patch('/api/users/update')
            .set("Cookie", TEST_DATA.userCookies)
            .send({password: "short"});

        expect(res.statusCode).toBe(400);
    });

    // Test 6: Rejection - First Name to Short (2char min) - Checked by Schema
    // Manual Test Success 11/10/2020
    test("Are Rejected when attempting to update first name when first name violates minimum length (2chars)", async () => {
        const res = await request(app)
            .patch('/api/users/update')
            .set("Cookie", TEST_DATA.userCookies)
            .send({first_name: "a"});

        expect(res.statusCode).toBe(400);
    });

    // Test 7: Rejection - Last Name to Short (2char min) - Checked by Schema
    // Manual Test Success 11/10/2020
    test("Are Rejected when attempting to update last name when last name violates minimum length (2chars)", async () => {
        const res = await request(app)
            .patch('/api/users/update')
            .set("Cookie", TEST_DATA.userCookies)
            .send({last_name: "a"});

        expect(res.statusCode).toBe(400);
    });

    // Test 8: Rejection - Email address not of email format - Checked by Schema
    // Manual Test Success 11/10/2020
    test("Are Rejected when attempting to update email when email does not match a valid format", async () => {
        const res = await request(app)
            .patch('/api/users/update')
            .set("Cookie", TEST_DATA.userCookies)
            .send({email: "thisisnotanemailaddress"});

        expect(res.statusCode).toBe(400);
    });
});

// Delete Route
describe("DELETE /api/users/delete", () => {

    // Test 1 - Successfully deletes account & removes cookie
    // Manual Test Success 11/10/2020
    test("Can Delete Account when Authenticated with Cookies", async () => {
        const res = await request(app)
            .delete('/api/users/delete')
            .set("Cookie", TEST_DATA.userCookies);

        const userDeleteCheck = await db.query(`
            SELECT email FROM users
            WHERE users.id = $1
        `, [TEST_DATA.userDetails.id]);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Your account has been deleted.");
        expect(userDeleteCheck.length).toBe(undefined);
        expect(res.get("Set-Cookie")).not.toBe(TEST_DATA.userCookies);
    });
});


// Logout Route
describe("Logout /api/users/logout", () => {

    // Test 1 - Successfully removes cookie
    // Manual Test Success 11/10/2020
    test("Can Logout User", async () => {
        const res = await request(app)
            .get('/api/users/logout')
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logout successful.");
        expect(res.get("Set-Cookie")).not.toBe(TEST_DATA.userCookies);
    });
});
