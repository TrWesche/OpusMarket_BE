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



// ╔═══╗╔═══╗╔═══╗ ╔═══╗╔══╗╔╗   ╔═══╗
// ║╔═╗║║╔═╗║║╔═╗║ ║╔══╝╚╣╠╝║║   ║╔══╝
// ║╚═╝║║╚═╝║║║ ║║ ║╚══╗ ║║ ║║   ║╚══╗
// ║╔══╝║╔╗╔╝║║ ║║ ║╔══╝ ║║ ║║ ╔╗║╔══╝
// ║║   ║║║╚╗║╚═╝║╔╝╚╗  ╔╣╠╗║╚═╝║║╚══╗
// ╚╝   ╚╝╚═╝╚═══╝╚══╝  ╚══╝╚═══╝╚═══╝

// Read Route
describe("GET /api/merchants/profile", () => {
    // Test 1: Successful Read - Note Requires Stored Token
    // Manual Test Success 11/10/2020
    test("Can Read Profile when Authenticated with Cookies", async () => {
        const res = await request(app).get('/api/merchants/profile').set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.merchant).toHaveProperty("display_name");
        expect(res.body.merchant).toHaveProperty("email");
        expect(res.body.merchant).toHaveProperty("about");
        expect(res.body.merchant).not.toHaveProperty("password");
    });

    // Note - Look into how to test separately to reduce repeated tests
    // Test 2: Rejection - No Token - Manual Test Success 11/10/2020
    test("Profile access rejected without Authentication Cookies", async () => {
        const res = await request(app).get('/api/merchants/profile');

        expect(res.statusCode).toBe(401);
    });

    // Note - Look into how to test separately to reduce repeated tests
    // Test 4: Rejection - Reject on Attempt to Access user with Same ID - Manual Test Success 11/10/2020
    test("Profile access rejected when using improper cookie type (user cookie instead of merchant)", async () => {
        const res = await request(app).get('/api/merchants/profile').set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });
});

// Update Route
describe("PATCH /api/merchants/update", () => {
    const patchVariables = {
        email: "AlteredEmail@test.com",
        display_name: "AlteredDisplayName",
        password: "AlteredPasswordAlteredPassword"
    }

    // Test 1: Successfully Update email
    // Manual Test Successful 11/10/2020
    test("Can Update Email & Display Name when Authenticated with Cookies", async () => {
        const res = await request(app)
            .patch('/api/merchants/update')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({email: patchVariables.email, display_name: patchVariables.display_name});

        expect(res.statusCode).toBe(200);
        expect(res.body.merchant).toHaveProperty("display_name");
        expect(res.body.merchant.email).toBe(patchVariables.email);
        expect(res.body.merchant.display_name).toBe(patchVariables.display_name);
        expect(res.body.merchant).not.toHaveProperty("password");
    });

    // Test 2: Successful Update Password (How to check this automatically?)
    // Manual Test Successful 11/10/2020
    test("Can Update Password when Authenticated with Cookies", async () => {
        const oldPassword = await db.query(`
            SELECT password FROM merchants
            WHERE merchants.id = $1
        `, [TEST_DATA.merchantDetails.id]);

        const res = await request(app)
            .patch('/api/merchants/update')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({password: patchVariables.password});

        const newPassword = await db.query(`
            SELECT password FROM merchants
            WHERE merchants.id = $1
        `, [TEST_DATA.merchantDetails.id]);

        expect(res.statusCode).toBe(200);
        expect(res.body.merchant).toHaveProperty("display_name");
        expect(res.body.merchant).not.toHaveProperty("password");
        expect(newPassword).not.toBe(patchVariables.password);
        expect(newPassword).not.toBe(oldPassword);
    });

    // Note - Look into how to test separately to reduce repeated tests
    // Test 3: Rejection - No Token
    // Manual Test Successful 11/10/2020
    test("Are Rejected with Unauthorized when Authentication not Present", async () => {
        const res = await request(app)
            .patch('/api/merchants/update')
            .send({email: patchVariables.email, display_name: patchVariables.display_name});

        expect(res.statusCode).toBe(401);
    });

    // Test 4: Rejection - Duplicate Email - Checked in Model
    // Manual Test Successful 11/10/2020
    test("Are Rejected when attempting update with a duplicate email address", async () => {
        const res = await request(app)
            .patch('/api/merchants/update')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({email: ADDITIONAL_USERS.testMerchant2.email});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("A merchant already exists with that email");
    });


    // Test 5: Rejection - Password to Short (16char min) - Checked by Schema
    // Manual Test Successful 11/10/2020
    test("Are Rejected when attempting update when password violates minimumt length (16 chars)", async () => {
        const res = await request(app)
            .patch('/api/merchants/update')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({password: "short"});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Unable to update");
        expect(res.body.message).toContain("password");
    });


    // Test 8: Rejection - Display Name to Short (2char min) - Checked by Schema
    // Manual Test Successful 11/10/2020
    test("Are Rejected when attempting update when display name violates minimumt length (2 chars)", async () => {
        const res = await request(app)
            .patch('/api/merchants/update')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({display_name: ""});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Unable to update");
        expect(res.body.message).toContain("display_name");
    });

    // Test 9: Rejection - Email address not of email format - Checked by Schema
    // Manual Test Successful 11/10/2020
    test("Are Rejected when attempting update when email does not match a valid format", async () => {
        const res = await request(app)
            .patch('/api/merchants/update')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({email: "thisisnotanemailaddress"});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Unable to update");
        expect(res.body.message).toContain("email");
    });

});

// Delete Route
describe("DELETE /api/merchants/delete", () => {

    // Test 1 - Successfully deletes account & removes cookie
    // Manual Test Success 11/10/2020
    test("Can Delete Account when Authenticated with Cookies", async () => {
        const res = await request(app)
            .delete('/api/merchants/delete')
            .set("Cookie", TEST_DATA.merchantCookies);

        const merchantDeleteCheck = await db.query(`
            SELECT email FROM merchants
            WHERE merchants.id = $1
        `, [TEST_DATA.merchantDetails.id]);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Your account has been deleted.");
        expect(merchantDeleteCheck.length).toBe(undefined);
        expect(res.get("Set-Cookie")).not.toBe(TEST_DATA.merchantCookies);
    });
});

// Logout Route
describe("GET /api/merchants/logout", () => {

    // Test 1 - Successfully removes cookie
    // Manual Test Success 11/10/2020
    test("Can Logout User", async () => {
        const res = await request(app)
            .get('/api/merchants/logout')
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logout successful.");
        expect(res.get("Set-Cookie")).not.toBe(TEST_DATA.merchantCookies);
    });
});


// ╔═══╗╔══╗ ╔═══╗╔╗ ╔╗╔════╗
// ║╔═╗║║╔╗║ ║╔═╗║║║ ║║║╔╗╔╗║
// ║║ ║║║╚╝╚╗║║ ║║║║ ║║╚╝║║╚╝
// ║╚═╝║║╔═╗║║║ ║║║║ ║║  ║║  
// ║╔═╗║║╚═╝║║╚═╝║║╚═╝║ ╔╝╚╗ 
// ╚╝ ╚╝╚═══╝╚═══╝╚═══╝ ╚══╝                      

// Create Route
describe("POST /api/merchants/about", () => {
    const postVariables = {
        headline: "NewHeadline",
        about: "NewAbout",
        logo_wide_url: "https://imageHost.com/newlogowideurl",
        logo_narrow_url: "https://imageHost.com/newlogonarrowurl"
    }

    // Test 1: Successfully Create About
    // Manual Test Successful 11/10/2020
    test("Can Create a New About Section for a Merchant", async () => {
        // Login Merchant without created About Section and Store Session Cookie
        const responseMerchant = await request(app)
        .post("/api/auth/merchant")
        .send({
            email: ADDITIONAL_USERS.testMerchant2.email,
            password: ADDITIONAL_USERS.testMerchant2.password,
        });

        const operationCookies = responseMerchant.get("Set-Cookie");

        // Execute the about section request
        const res = await request(app)
            .post('/api/merchants/about')
            .set("Cookie", operationCookies)
            .send({
                headline: postVariables.headline, 
                about: postVariables.about, 
                logo_narrow_url: postVariables.logo_narrow_url,
                logo_wide_url: postVariables.logo_wide_url
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.about).toHaveProperty("headline");
        expect(res.body.about.headline).toBe(postVariables.headline);
        expect(res.body.about.logo_wide_url).toBe(postVariables.logo_wide_url);
    });

    
    // Test 2: Rejection - No Token
    test("Are Rejected with Unauthorized when Authentication not Present", async () => {
        const res = await request(app)
            .post('/api/merchants/about')
            .send({
                headline: postVariables.headline, 
                about: postVariables.about, 
                logo_narrow_url: postVariables.logo_narrow_url,
                logo_wide_url: postVariables.logo_wide_url
            });

        expect(res.statusCode).toBe(401);
    });

    // Test 3: Rejection - Display Name to Short (2char min) - Checked by Schema
    test("Are Rejected when attempting update when logo_wide_url does not match a valid uri format", async () => {
        // Login Merchant without created About Section and Store Session Cookie
        const responseMerchant = await request(app)
        .post("/api/auth/merchant")
        .send({
            email: ADDITIONAL_USERS.testMerchant2.email,
            password: ADDITIONAL_USERS.testMerchant2.password,
        });

        const operationCookies = responseMerchant.get("Set-Cookie");

        // Execute the about section request
        const res = await request(app)
            .post('/api/merchants/about')
            .set("Cookie", operationCookies)
            .send({
                headline: postVariables.headline, 
                about: postVariables.about, 
                logo_narrow_url: postVariables.logo_narrow_url,
                logo_wide_url: "thisisnotavalidurl"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Unable to create Merchant About");
        expect(res.body.message).toContain("logo_wide_url");
    });

    // Test 4: Rejection - Email address not of email format - Checked by Schema
    test("Are Rejected when attempting update when logo_narrow_url does not match a valid uri format", async () => {
        // Login Merchant without created About Section and Store Session Cookie
        const responseMerchant = await request(app)
        .post("/api/auth/merchant")
        .send({
            email: ADDITIONAL_USERS.testMerchant2.email,
            password: ADDITIONAL_USERS.testMerchant2.password,
        });

        const operationCookies = responseMerchant.get("Set-Cookie");

        const res = await request(app)
            .post('/api/merchants/about')
            .set("Cookie", operationCookies)
            .send({
                headline: postVariables.headline, 
                about: postVariables.about, 
                logo_narrow_url:  "thisisnotavalidurl",
                logo_wide_url: postVariables.logo_wide_url
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Unable to create Merchant About");
        expect(res.body.message).toContain("logo_narrow_url");
    });


});

// Read Route
describe("GET /api/merchants/about", () => {
    // Test 1: Successful Read - Note Requires Stored Token
    // Manual Test Success 11/10/2020
    test("Can Read About Data when Authenticated with Cookies", async () => {
        const res = await request(app).get('/api/merchants/about').set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.about).toHaveProperty("headline");
        expect(res.body.about).toHaveProperty("about");
        expect(res.body.about).toHaveProperty("logo_wide_url");
        expect(res.body.about).toHaveProperty("logo_narrow_url");
    });

    // Note - Look into how to test separately to reduce repeated tests
    // Test 2: Rejection - No Token - Manual Test Success 11/10/2020
    test("Profile access rejected without Authentication Cookies", async () => {
        const res = await request(app).get('/api/merchants/about');

        expect(res.statusCode).toBe(401);
    });

    // Note - Look into how to test separately to reduce repeated tests
    // Test 3 Rejection - Reject on Attempt to Access user with Same ID - Manual Test Success 11/10/2020
    test("Profile access rejected when using improper cookie type (user cookie instead of merchant)", async () => {
        const res = await request(app).get('/api/merchants/about').set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });
});

// Update Route
describe("PATCH /api/merchants/about", () => {
    const patchVariables = {
        headline: "AlteredHeadline",
        about: "AlteredAbout",
        logo_wide_url: "https://imageHost.com/alteredlogowide",
        logo_narrow_url: "https://imageHost.com/alteredlogonarrow"
    }

    // Test 1: Successfully Update Headline and Logo
    test("Can Update Headline & Wide Logo Name when Authenticated with Cookies", async () => {
        const res = await request(app)
            .patch('/api/merchants/about')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({headline: patchVariables.headline, logo_wide_url: patchVariables.logo_wide_url});

        expect(res.statusCode).toBe(200);
        expect(res.body.about).toHaveProperty("headline");
        expect(res.body.about.headline).toBe(patchVariables.headline);
        expect(res.body.about.logo_wide_url).toBe(patchVariables.logo_wide_url);
    });

    // Test 2: Rejection - No Token
    test("Are Rejected with Unauthorized when Authentication not Present", async () => {
        const res = await request(app)
            .patch('/api/merchants/about')
            .send({headline: patchVariables.headline, logo_wide_url: patchVariables.logo_wide_url});

        expect(res.statusCode).toBe(401);
    });

    // Test 3: Rejection - Display Name to Short (2char min) - Checked by Schema
    test("Are Rejected when attempting update when logo_wide_url does not match a valid uri format", async () => {
        const res = await request(app)
            .patch('/api/merchants/about')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({logo_wide_url: "thisisnotavalidurl"});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Unable to update");
        expect(res.body.message).toContain("logo_wide_url");
    });

    // Test 4: Rejection - Email address not of email format - Checked by Schema
    test("Are Rejected when attempting update when logo_narrow_url does not match a valid uri format", async () => {
        const res = await request(app)
            .patch('/api/merchants/about')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({logo_narrow_url: "thisisnotavalidurl"});

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toContain("Unable to update");
        expect(res.body.message).toContain("logo_narrow_url");
    });
});

// Delete Route
describe("DELETE /api/merchants/about", () => {

    // Test 1 - Successfully deletes account & removes cookie
    // Manual Test Success 11/10/2020
    test("Can Delete About when Authenticated with Cookies", async () => {
        const res = await request(app)
            .delete('/api/merchants/about')
            .set("Cookie", TEST_DATA.merchantCookies);

        const deleteCheck = await db.query(`
            SELECT about FROM merchant_about
            WHERE merchant_about.merchant_id = $1
        `, [TEST_DATA.merchantDetails.id]);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Your about data has been deleted.");
        expect(deleteCheck.length).toBe(undefined);
    });
});


// ╔═══╗╔╗ ╔╗╔══╗ ╔╗   ╔══╗╔═══╗
// ║╔═╗║║║ ║║║╔╗║ ║║   ╚╣╠╝║╔═╗║
// ║╚═╝║║║ ║║║╚╝╚╗║║    ║║ ║║ ╚╝
// ║╔══╝║║ ║║║╔═╗║║║ ╔╗ ║║ ║║ ╔╗
// ║║   ║╚═╝║║╚═╝║║╚═╝║╔╣╠╗║╚═╝║
// ╚╝   ╚═══╝╚═══╝╚═══╝╚══╝╚═══╝
                             
// Read Routes
describe("GET /api/merchants", () => {
    // Test 1: Successful Read - List of Merchants
    test("Can Retreive Merchants List w/o Filtering", async () => {
        const res = await request(app).get('/api/merchants');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("merchants");
        expect(res.body.merchants.length).toBe(2);
    });

    // Test 2: Successfully Filter List of Merchants based on Search String (s)
    test("Can Retreive Merchants List with search filter (s)", async () => {
        const res = await request(app).get(`/api/merchants?s=STATIC`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("merchants");
        expect(res.body.merchants.length).toBe(1);
    });
});

describe("GET /api/merchants/:merchant_id", () => {
    // Test 1: Successful Read - List of Merchants
    test("Can Retreive Existing Merchant's Homepage", async () => {
        const res = await request(app).get(`/api/merchants/${TEST_DATA.merchantDetails.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("merchant");
        expect(res.body.merchant).toHaveProperty("about");
        expect(res.body.merchant).toHaveProperty("bios");
        expect(res.body.merchant).toHaveProperty("gatherings");
        expect(res.body.merchant).toHaveProperty("products");
    });

    // Test 2: Successfully Filter List of Merchants based on Search String (s)
    test("Returns 404 on invalid merchant", async () => {
        const res = await request(app).get(`/api/merchants/0`);

        expect(res.statusCode).toBe(404);
    });
});

describe("GET /api/merchants/:merchant_id/store", () => {
    // Test 1: Successful Read - List of Merchants
    test("Can Retreive Existing Merchant's Store Page", async () => {
        const res = await request(app).get(`/api/merchants/${TEST_DATA.merchantDetails.id}/store`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("products");
        expect(res.body).toHaveProperty("metas");
        expect(res.body).toHaveProperty("features");
    });
});
