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



// Create Gathering
describe("POST /api/gatherings/new", () => {
    const postVariables = {
        title: "NewGathering",
        description: "NewGatheringDescription",
        link: "https://gatheringService.com/newgatheringlink",
        gathering_dt: "2021-01-21T21:00:00Z"
    }

    // Test 1 - Successful Creation
    // Manual Test Successful 11/10/2020
    test("Can Create a New Gathering for a Merchant", async () => {
        // Execute the about section request
        const res = await request(app)
            .post('/api/gatherings/new')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                title: postVariables.title, 
                description: postVariables.description, 
                link: postVariables.link,
                gathering_dt: postVariables.gathering_dt
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.gathering).toHaveProperty("title");
        expect(res.body.gathering.title).toBe(postVariables.title);
        expect(res.body.gathering.link).toBe(postVariables.link);
    });

    // Test 2 - Reject on Empty Title
    // Manual Test - Successful 11/10/2020
    test("Reject Gathering Creation on Empty Title", async () => {
        // Execute the about section request
        const res = await request(app)
            .post('/api/gatherings/new')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                title: "", 
                description: postVariables.description, 
                link: postVariables.link,
                gathering_dt: postVariables.gathering_dt
            });

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Reject on Incorrect Date/Time Stamp
    // Manual Test - Successful 11/10/2020
    test("Reject on Incorrect Date/Time Stamp", async () => {
        // Execute the about section request
        const res = await request(app)
            .post('/api/gatherings/new')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                title: postVariables.title,  
                description: postVariables.description, 
                link: postVariables.link,
                gathering_dt: "2021-01-21T21"
            });

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Reject on Missing User Token
    // Manual Test - Successful 11/10/2020
    test("Reject on Missing User Token", async () => {
        // Execute the about section request
        const res = await request(app)
            .post('/api/gatherings/new')
            .send({
                title: postVariables.title,  
                description: postVariables.description, 
                link: postVariables.link,
                gathering_dt: postVariables.gathering_dt
            });

        expect(res.statusCode).toBe(401);
    });


    // Test 5 - Reject on Non-Merchant Token
    // Manual Test - Successful 11/10/2020
    test("Reject on Missing User Token", async () => {
        // Execute the about section request
        const res = await request(app)
            .post('/api/gatherings/new')
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                title: postVariables.title,  
                description: postVariables.description, 
                link: postVariables.link,
                gathering_dt: postVariables.gathering_dt
            });

        expect(res.statusCode).toBe(401);
    });
});

// Add Gathering Merchants
describe("POST /api/gatherings/:gathering_id/new/merchant", () => {
    // Test 1 - Successful Addition of a Single Merchant
    // Manual Test - Successful 11/10/2020
    test("Successful Addition of a Merchant to Gathering", async () => {
        const additionalMerchantId = await db.query(`
            SELECT id FROM merchants
            WHERE merchants.email = $1`,
        [ADDITIONAL_USERS.testMerchant2.email]);

        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/${TEST_DATA.gathering.id}/new/merchant`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                merchants: [
                    {id: additionalMerchantId.rows[0].id}
                ]
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("gathering_merchants");
    });


    // Test 3 - Reject on non-integer merchant ID
    // Manual Test - Successful 11/10/2020
    test("Reject on non-integer merchant ID", async () => {
        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/${TEST_DATA.gathering.id}/new/merchant`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                merchants: [
                    {id: ADDITIONAL_USERS.testMerchant2.display_name}
                ]
            });

        expect(res.statusCode).toBe(400);
    });


    // Test 4 - Fail on Non-Existent Merchant ID
    // Manual Test - Successful 11/10/2020
    test("Reject on Non-Existent Merchant ID", async () => {
        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/${TEST_DATA.gathering.id}/new/merchant`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                merchants: [
                    {id: 1}
                ]
            });

        expect(res.statusCode).toBe(400);
    });

    // Test 5 - Fail on Missing Merchant Token
    test("Reject on Missing Merchant Token", async () => {
        const additionalMerchantId = await db.query(`
            SELECT id FROM merchants
            WHERE merchants.email = $1`,
        [ADDITIONAL_USERS.testMerchant2.email]);

        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/${TEST_DATA.gathering.id}/new/merchant`)
            .send({
                merchants: [
                    {id: additionalMerchantId.rows[0].id}
                ]
            });

        expect(res.statusCode).toBe(401);
    });

    // Test 6 - Reject on Non-Merchant Token
    test("Reject on Non-Merchant Token", async () => {
        const additionalMerchantId = await db.query(`
            SELECT id FROM merchants
            WHERE merchants.email = $1`,
        [ADDITIONAL_USERS.testMerchant2.email]);

        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/${TEST_DATA.gathering.id}/new/merchant`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                merchants: [
                    {id: additionalMerchantId.rows[0].id}
                ]
            });

        expect(res.statusCode).toBe(401);
    });
});

// Add Gathering Images
describe("POST /api/gatherings/:gathering_id/new/img", () => {
    const postVariables = {
        image1:{
            url: "https://imageHostingServer.com/newgatheringimage1",
            alt_text: "AltTextNewGatheringImage1"
        },
        image2: {
            url: "https://imageHostingServer.com/newgatheringimage2",
            alt_text: "AltTextNewGatheringImage2"
        }
    }

    // Test 1 - Successful Addition of a Single Image
    // Manual Test - Successful 11/10/2020
    test("Successful Addition of a Image to Gathering", async () => {
        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/${TEST_DATA.gathering.id}/new/img`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({images: [postVariables.image1]});

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("gathering_images");
    });

    // Test 2 - Reject on non-uri image link
    // Manual Test - Successful 11/10/2020
    test("Reject on non-uri image link", async () => {
        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/${TEST_DATA.gathering.id}/new/img`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({images: [
                {
                    url: "thisisnotaurl",
                    alt_text: postVariables.image1.alt_text
                }
            ]});

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Reject on Missing Merchant Token
    test("Reject on Missing Merchant Token", async () => {
        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/${TEST_DATA.gathering.id}/new/img`)
            .send({images: [postVariables.image1]});

        expect(res.statusCode).toBe(401);
    });

    // Test 4 - Reject on Non-Merchant Token
    test("Reject on Non-Merchant Token", async () => {
        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/${TEST_DATA.gathering.id}/new/img`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({images: [postVariables.image1]});

        expect(res.statusCode).toBe(401);
    });

    // Test 5 - Reject on Non-Existent Gathering
    test("Reject on Non-Existent Gathering", async () => {
        // Execute the about section request
        const res = await request(app)
            .post(`/api/gatherings/0/new/img`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({images: [postVariables.image1]});

        expect(res.statusCode).toBe(404);
    });
});


// Get Gathering Details
describe("GET /api/gatherings/:gathering_id", () => {
    // Test 1 - Successful Retrieval of an Existing Gathering
    // Manual Test - Successful 11/10/2020
    test("Successful Retrieval of an Existing Gathering", async () => {
        // Execute the about section request
        const res = await request(app)
            .get(`/api/gatherings/${TEST_DATA.gathering.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("gathering");
        expect(res.body.gathering.title).toBe(SOURCE_DATA_MERCHANT.testGathering.title);
        expect(res.body.gathering.link).toBe(SOURCE_DATA_MERCHANT.testGathering.link);
    });

    // Test 2 - Reject on Non-Existing Gathering
    // Manual Test - Successful 11/10/2020
    test("Reject on Non-Existing Gathering", async () => {
        // Execute the about section request
        const res = await request(app)
            .get(`/api/gatherings/0`);

        expect(res.statusCode).toBe(404);
    });
});

// Get Merchant Gatherings
describe("GET /api/merch/:merchant_id", () => {
    // Test 1 - Successful Retrieval of Merchant Gatherings (where they exist)
    // Manual Test - Successful 11/10/2020
    test("Successful Retrieval of Merchant Gatherings", async () => {
        // Execute the about section request
        const res = await request(app)
            .get(`/api/gatherings/merch/${TEST_DATA.merchantDetails.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("gatherings");
        expect(res.body.gatherings.length).toBe(1);
    });
});


// Update Gathering
describe("PATCH /api/gatherings/:gathering_id", () => {
    const patchVariables = {
        title: "AlteredGathering",
        description: "AlteredGatheringDescription",
        link: "https://gatheringService.com/alteredgatheringlink",
        gathering_dt: "2022-11-22T22:00:00Z"
    }

    // Test 1 - Successful Update Title, Time
    // Manual Test Successful 11/10/2020
    test("Can successfully update gathering title and link", async () => {
        // Execute the about section request
        const res = await request(app)
            .patch(`/api/gatherings/${TEST_DATA.gathering.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                title: patchVariables.title, 
                link: patchVariables.link
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.gathering).toHaveProperty("title");
        expect(res.body.gathering.title).toBe(patchVariables.title);
        expect(res.body.gathering.link).toBe(patchVariables.link);
    });

    // Test 2 - Reject on Empty Title
    // Manual Test - Successful 11/10/2020
    test("Reject on Empty Title", async () => {
        // Execute the about section request
        const res = await request(app)
            .patch(`/api/gatherings/${TEST_DATA.gathering.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                title: "", 
                link: patchVariables.link
            });

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Reject on Incorrect Date/Time Stamp
    // Manual Test - Successful 11/10/2020
    test("Reject on Incorrect Date/Time Stamp", async () => {
        // Execute the about section request
        const res = await request(app)
            .patch(`/api/gatherings/${TEST_DATA.gathering.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                title: patchVariables.title, 
                gathering_dt: "22-11-22T22:00"
            });

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Fail on Missing User Token
    test("Fail on Missing User Token", async () => {
        // Execute the about section request
        const res = await request(app)
            .patch(`/api/gatherings/${TEST_DATA.gathering.id}`)
            .send({
                title: patchVariables.title, 
                link: patchVariables.link
            });

        expect(res.statusCode).toBe(401);
    });

    // Test 5 - Reject on Non-Merchant Token
    test("Reject on Non-Merchant Token", async () => {
        // Execute the about section request
        const res = await request(app)
            .patch(`/api/gatherings/${TEST_DATA.gathering.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                title: patchVariables.title, 
                link: patchVariables.link
            });

        expect(res.statusCode).toBe(401);
    });
});


// Delete Gathering
describe("DELETE /api/gatherings/:gathering_id", () => {
    // Test 1 - Successfully Delete Image
    // Manual Test Successful - 11/12/2020
    test("Can delete a gathering", async () => {
        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Gathering removed.");
    });

    // Test 2 - Reject Delete on Invalid ID
    // Manual Test Successful - 11/12/2020
    test("Reject Delete on Invalid GatheringID", async () => {
        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/0`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(404);
    });

    // Test 3 - Reject Delete on Not Gathering Organizer
    // Manual Test Successful 11/12/2020
    test("Reject Delete on Not Gathering Organizer", async () => {
        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });

    // Test 4 - Reject Delete on Missing Authentication
    // Manual Test Successful 11/12/2020
    test("Reject Delete on Missing Authentication", async () => {
        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}`);

        expect(res.statusCode).toBe(401);
    });
});

// Delete Gathering Participant
describe("DELETE /api/gatherings/:gathering_id/merchant/:participating_merchant_id", () => {
    // Test 1 - Successfully Delete Participant
    test("Can delete a gathering participating merchant", async () => {
        const addMerchantId = await db.query(`
            SELECT id FROM merchants
            WHERE merchants.email = $1`,
        [ADDITIONAL_USERS.testMerchant2.email]);

        await db.query(`
            INSERT INTO gathering_merchants 
                (gathering_id, merchant_id)
            VALUES
                ($1, $2)
            RETURNING *`,
        [TEST_DATA.gathering.id, addMerchantId.rows[0].id]);

        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}/merchant/${addMerchantId.rows[0].id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Gathering Participant removed.");
    });

    // Test 2 - Reject Delete on Invalid Participant ID
    test("Reject Delete on Invalid Participating Merchant ID", async () => {
        const addMerchantId = await db.query(`
            SELECT id FROM merchants
            WHERE merchants.email = $1`,
        [ADDITIONAL_USERS.testMerchant2.email]);

        await db.query(`
            INSERT INTO gathering_merchants 
                (gathering_id, merchant_id)
            VALUES
                ($1, $2)
            RETURNING *`,
        [TEST_DATA.gathering.id, addMerchantId.rows[0].id]);

        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}/merchant/${addMerchantId.rows[0].id + 100}`)
            .set("Cookie", TEST_DATA.merchantCookies);
            
        expect(res.statusCode).toBe(404);
    });

    // Test 3 - Reject Delete on Not Gathering Organizer
    test("Reject Delete on Not Gathering Organizer", async () => {
        const addMerchantId = await db.query(`
            SELECT id FROM merchants
            WHERE merchants.email = $1`,
        [ADDITIONAL_USERS.testMerchant2.email]);

        await db.query(`
            INSERT INTO gathering_merchants 
                (gathering_id, merchant_id)
            VALUES
                ($1, $2)
            RETURNING *`,
        [TEST_DATA.gathering.id, addMerchantId.rows[0].id]);

        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}/merchant/${addMerchantId.rows[0].id + 100}`)
            .set("Cookie", TEST_DATA.userCookies);
            
        expect(res.statusCode).toBe(401);
    });

    
    // Test 4 - Reject Delete on Missing Authentication
    test("Reject Delete on Missing Authentication", async () => {
        const addMerchantId = await db.query(`
            SELECT id FROM merchants
            WHERE merchants.email = $1`,
        [ADDITIONAL_USERS.testMerchant2.email]);

        await db.query(`
            INSERT INTO gathering_merchants 
                (gathering_id, merchant_id)
            VALUES
                ($1, $2)
            RETURNING *`,
        [TEST_DATA.gathering.id, addMerchantId.rows[0].id]);

        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}/merchant/${addMerchantId.rows[0].id + 100}`);
            
        expect(res.statusCode).toBe(401);
    });
});


describe("DELETE /api/gatherings/:gathering_id/img/:img_id", () => {
    const testImage = {
        url: "https://imageHostingServer.com/newgatheringimage1",
        alt_text: "AltTextNewGatheringImage1"
    }

    // Test 1 - Successfully Delete Gathering Image
    test("Can delete a gathering image", async () => {
        const addImageId = await db.query(`
            INSERT INTO gathering_images 
                (gathering_id, url, alt_text)
            VALUES
                ($1, $2, $3)
            RETURNING *`,
        [TEST_DATA.gathering.id, testImage.url, testImage.alt_text]);

        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}/img/${addImageId.rows[0].id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Gathering Image removed.");
    });

    // Test 2 - Reject Delete on Invalid Image ID
    // Manual Test Successful 11/12/2020
    test("Reject Delete on Invalid Image ID", async () => {
        const addImageId = await db.query(`
            INSERT INTO gathering_images 
                (gathering_id, url, alt_text)
            VALUES
                ($1, $2, $3)
            RETURNING *`,
        [TEST_DATA.gathering.id, testImage.url, testImage.alt_text]);

        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}/img/${addImageId.rows[0].id + 100}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(404);
    });


    // Test 3 - Reject Delete on Not Gathering Organizer
    // Manual Test Successful 11/12/2020
    test("Reject Delete on Not Gathering Organizer", async () => {
        const addImageId = await db.query(`
            INSERT INTO gathering_images 
                (gathering_id, url, alt_text)
            VALUES
                ($1, $2, $3)
            RETURNING *`,
        [TEST_DATA.gathering.id, testImage.url, testImage.alt_text]);

        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}/img/${addImageId.rows[0].id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });

    // Test 4 - Reject Delete on Missing Authentication
    // Manual Test Successful 11/12/2020
    test("Reject Delete on Missing Authentication", async () => {
        const addImageId = await db.query(`
            INSERT INTO gathering_images 
                (gathering_id, url, alt_text)
            VALUES
                ($1, $2, $3)
            RETURNING *`,
        [TEST_DATA.gathering.id, testImage.url, testImage.alt_text]);

        // Execute the about section request
        const res = await request(app)
            .delete(`/api/gatherings/${TEST_DATA.gathering.id}/img/${addImageId.rows[0].id}`)

        expect(res.statusCode).toBe(401);
    });
});