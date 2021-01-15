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

// Create Order
describe("POST /api/sqpay/process-payment", () => {
    const verificationToken = {
        amount: `${SOURCE_DATA_USER.testOrder.order.order_total / 100}`,
        currencyCode: 'USD',
        intent: 'CHARGE',
        billingContact: {
          familyName: 'Smith',
          givenName: 'John',
          email: 'jsmith@example.com',
          country: 'GB',
          city: 'London',
          addressLines: ["1235 Emperor's Gate"],
          postalCode: 'SW7 4JA',
          phone: '020 7946 0532',
        },
    }
    
    // Test 1 - Successful Payment
    // Manual Test Successful 11/15/2020
    test("Can Successfully Process Payment on an Order", async () => {
        const res = await request(app)
            .post('/api/sqpay/process-payment')
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                order_id: TEST_DATA.order.id,
                nonce: "cnon:card-nonce-ok",
                buyerVerficationToken: verificationToken
            })

        expect(res.statusCode).toBe(200);
    });
});