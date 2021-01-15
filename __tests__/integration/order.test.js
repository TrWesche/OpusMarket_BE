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

    // Test 2 - Reject on Invalid Coupon ID
    //  Manual Test Successful 11/15/2020
    test("Reject on Invalid Coupon ID", async () => {
        const res = await request(app)
            .post('/api/orders/new')
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                order: {
                    products: [ {
                        "id": TEST_DATA.product.id,
                        "quantity": 3,
                        "modifier_id": TEST_DATA.product.modifier.id,
                        "coupon_id": 0 
                    }
                    ]
                }
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Reject on Invalid Modifier ID
    //  Manual Test Successful 11/15/2020
    test("Reject on Invalid Modifier ID", async () => {
        const res = await request(app)
            .post('/api/orders/new')
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                order: {
                    products: [ {
                        "id": TEST_DATA.product.id,
                        "quantity": 3,
                        "modifier_id": 0,
                        "coupon_id": TEST_DATA.product.coupon.id    
                    }
                    ]
                }
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Reject on Missing Product ID
    // Manual Test Successful 11/15/2020
    test("Reject on Missing Product ID", async () => {
        const res = await request(app)
            .post('/api/orders/new')
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                order: {
                    products: [ {
                        "quantity": 3,
                        "modifier_id": TEST_DATA.product.modifier.id,
                        "coupon_id": TEST_DATA.product.coupon.id    
                    }
                    ]
                }
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 5 - Reject on Missing Quantity
    // Manual Test Successful 11/15/2020
    test("Reject on Missing Quantity", async () => {
        const res = await request(app)
            .post('/api/orders/new')
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                order: {
                    products: [ {
                        "id": TEST_DATA.product.id,
                        "modifier_id": TEST_DATA.product.modifier.id,
                        "coupon_id": TEST_DATA.product.coupon.id    
                    }
                    ]
                }
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 6 - Reject on Missing User Token
    // Manual Test Successful 11/15/2020
    test("Reject on Missing User Token", async () => {
        const res = await request(app)
            .post('/api/orders/new')
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

        expect(res.statusCode).toBe(401);
    });


    // Test 7 - Reject on Non-Buyer Token
    // Manual Test Successful 11/15/2020
    test("Reject on Non-Buyer Token", async () => {
        const res = await request(app)
            .post('/api/orders/new')
            .set("Cookie", TEST_DATA.merchantCookies)
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

        expect(res.statusCode).toBe(401);
    });

});

// Read Order History
describe("GET /api/orders/history", () => {
    // Test 1 - Successful Read
    test("Can Successfully read order list", async () => {
        const res = await request(app)
            .get('/api/orders/history')
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("orders");
        expect(res.body.orders[0]).toHaveProperty("id");
        expect(res.body.orders[0].id).toBe(TEST_DATA.order.id);
    });
});

// Read Order
describe("GET /api/orders/:order_id", () => {
    // Test 1 - Successful Read
    // Manual Test Successful 11/15/2020
    test("Can Successfully read order data", async () => {
        const res = await request(app)
            .get(`/api/orders/${TEST_DATA.order.id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("order");
        expect(res.body.order).toHaveProperty("order_total");
        expect(res.body.order.order_total).toBe(TEST_DATA.order.order_total);
    });


    // Test 2 - Reject on Missing User Token
    // Manual Test Successful 11/15/2020
    test("Can Successfully read order data", async () => {
        const res = await request(app)
            .get(`/api/orders/${TEST_DATA.order.id}`);

        expect(res.statusCode).toBe(401);
    });

    // Test 3 - Reject on Non-Buyer Token
    // Manual Test Successful 11/15/2020
    test("Can Successfully read order data", async () => {
        const res = await request(app)
            .get(`/api/orders/${TEST_DATA.order.id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(401);
    });
});