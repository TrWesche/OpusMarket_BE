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
describe("POST /api/orders/new", () => {
    // Test 1 - Successful Creation
    // Manual Test Successful 11/15/2020
    test("Can Successfully create a new order", async () => {
        const res = await request(app)
            .post('/api/orders/new')
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                order: {
                    products: [ {
                        "id": TEST_DATA.product.id,
                        "quantity": 3,
                        "modifier_id": TEST_DATA.product.modifier.id,
                        "coupon_id": TEST_DATA.product.coupon.id    
                    }
                    ]
                }
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("order");
        expect(res.body.order).toHaveProperty("id");
        expect(res.body.order).toHaveProperty("order_total");
        expect(res.body.order).toHaveProperty("products");
    });
});