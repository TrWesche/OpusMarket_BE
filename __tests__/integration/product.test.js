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

// ======================
// ---- CREATE TESTS ----
// ======================

// Create Product
// --------------------------
describe("POST /api/products/new", () => {
    const postVariable1 = {
        name: "NewProduct1",
        description: "NewProductDescription1",
        base_price: 9999
    };

    const postVariable2 = {
        name: "NewProduct2",
        description: "NewProductDescription2",
        base_price: 1111
    }

    // Test 1 - Single Product Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create a single new product", async () => {
        const res = await request(app)
            .post('/api/products/new')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                products:  [
                    {
                        name: postVariable1.name,
                        description: postVariable1.description,
                        base_price: postVariable1.base_price
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product");
        expect(res.body.product[0]).toHaveProperty("merchant_id");
        expect(res.body.product[0].merchant_id).toBe(TEST_DATA.merchantDetails.id);
        expect(res.body.product[0]).toHaveProperty("base_price");
        expect(res.body.product[0].base_price).toBe(postVariable1.base_price);
    });

    // Test 2 - Multiple Product Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create multiple new products", async () => {
        const res = await request(app)
            .post('/api/products/new')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                products:  [
                    {
                        name: postVariable1.name,
                        description: postVariable1.description,
                        base_price: postVariable1.base_price
                    },
                    {
                        name: postVariable2.name,
                        description: postVariable2.description,
                        base_price: postVariable2.base_price
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product");
        expect(res.body.product.length).toBe(2);
    });

    // Test 3 - Rejection - Missing Required Information
    // Manual Test Success - 11/12/2020
    test("Rejection - Missing Required Information (name)", async () => {
        const res = await request(app)
            .post('/api/products/new')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                products:  [
                    {
                        description: postVariable1.description,
                        base_price: postVariable1.base_price
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Rejection - Negative Value for Price
    // Manual Test Success - 11/12/2020
    test("Rejection - Negative Value for Price", async () => {
        const res = await request(app)
            .post('/api/products/new')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                products:  [
                    {
                        name: postVariable1.name,
                        description: postVariable1.description,
                        base_price: -1234
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 5 - Rejection - Min Length Title / Description Violation
    // Manual Test Success - 11/12/2020
    test("Rejection - Min Length Title / Description Violation", async () => {
        const res = await request(app)
            .post('/api/products/new')
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                products:  [
                    {
                        name: postVariable1.name,
                        description: "",
                        base_price: postVariable1.base_price
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 6 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Missing Required Information (name)", async () => {
        const res = await request(app)
            .post('/api/products/new')
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                products:  [
                    {
                        name: postVariable1.name,
                        description: postVariable1.description,
                        base_price: postVariable1.base_price
                    }
                ]
            })

        expect(res.statusCode).toBe(401);
    });

});

// Add Product Image
// --------------------------
describe("POST /api/products/:product_id/new/img", () => {
    const postVariable1 = {
        url: "https://imageProviderService.com/newproductimage1",
        alt_text: "NewProductImage1",
        weight: 1
    };

    const postVariable2 = {
        url: "https://imageProviderService.com/newproductimage2",
        alt_text: "NewProductImage2",
        weight: 2
    };

    // Test 1 - Single Product Image Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create a single new product image", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/img`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                images:  [
                    {
                        url: postVariable1.url,
                        alt_text: postVariable1.alt_text,
                        weight: postVariable1.weight
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_images");
        expect(res.body.product_images.length).toBe(1);
        expect(res.body.product_images[0]).toHaveProperty("product_id");
        expect(res.body.product_images[0].product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_images[0]).toHaveProperty("url");
        expect(res.body.product_images[0].url).toBe(postVariable1.url);
    });


    // Test 2 - Multiple Product Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create multiple new product images", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/img`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                images:  [
                    {
                        url: postVariable1.url,
                        alt_text: postVariable1.alt_text,
                        weight: postVariable1.weight
                    },
                    {
                        url: postVariable2.url,
                        alt_text: postVariable2.alt_text,
                        weight: postVariable2.weight
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_images");
        expect(res.body.product_images.length).toBe(2);
        expect(res.body.product_images[0]).toHaveProperty("product_id");
        expect(res.body.product_images[0]).toHaveProperty("url");
    });

    // Test 3 - Rejection - Missing Required Information
    // Manual Test Success - 11/12/2020
    test("Reject - Missing Required Information (alt_text)", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/img`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                images:  [
                    {
                        url: postVariable1.url,
                        weight: postVariable1.weight
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Rejection - Value outside of Weight Bounds
    // Manual Test Success - 11/12/2020
    test("Reject - Value outside of Weight Bounds", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/img`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                images:  [
                    {
                        url: postVariable1.url,
                        alt_text: postVariable1.alt_text,
                        weight: 0
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 5 - Rejection - Invalid url
    // Manual Test Success - 11/12/2020
    test("Reject - Invalid url", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/img`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                images:  [
                    {
                        url: "thisisnotaurl",
                        alt_text: postVariable1.alt_text,
                        weight: postVariable1.weight
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 6 - Rejection - Alt Text to Short
    // Manual Test Success - 11/12/2020
    test("Reject - Alt Text to Short", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/img`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                images:  [
                    {
                        url: postVariable1.url,
                        alt_text: "",
                        weight: postVariable1.weight
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 7 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Reject - Not a Merchant User", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/img`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                images:  [
                    {
                        url: postVariable1.url,
                        alt_text: postVariable1.alt_text,
                        weight: postVariable1.weight
                    }
                ]
            })

        expect(res.statusCode).toBe(401);
    });
});

// Add Product Meta Data
// --------------------------
describe("POST /api/products/:product_id/new/meta", () => {
    const postVariable1 = {
        title: "NewMetaTitle1",
        description: "NewMetaDescription1"
    };

    const postVariable2 = {
        title: "NewMetaTitle2",
        description: "NewMetaDescription2"
    };

    // Test 1 - Single Meta Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create a single new product meta", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/meta`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                metas:  [
                    {
                        title: postVariable1.title,
                        description: postVariable1.description
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_metas");
        expect(res.body.product_metas.length).toBe(1);
        expect(res.body.product_metas[0]).toHaveProperty("product_id");
        expect(res.body.product_metas[0].product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_metas[0]).toHaveProperty("title");
        expect(res.body.product_metas[0].title).toBe(postVariable1.title);
    });


    // Test 2 - Multiple Product Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create multiple product meta", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/meta`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                metas:  [
                    {
                        title: postVariable1.title,
                        description: postVariable1.description
                    },
                    {
                        title: postVariable2.title,
                        description: postVariable2.description
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_metas");
        expect(res.body.product_metas.length).toBe(2);
        expect(res.body.product_metas[0]).toHaveProperty("product_id");
        expect(res.body.product_metas[0]).toHaveProperty("title");
    });


    // Test 3 - Rejection - Missing Required Information
    // Manual Test Success - 11/12/2020
    test("Rejection - Missing Required Information", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/meta`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                metas:  [
                    {
                        title: postVariable1.title
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Rejection - Name Length to Short (1 char)
    // Manual Test Success - 11/12/2020
    test("Rejection - Name Length to Short (1 char)", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/meta`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                metas:  [
                    {
                        title: "",
                        description: postVariable1.description
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });
    
    // Test 5 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/meta`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                metas:  [
                    {
                        title: postVariable1.title,
                        description: postVariable1.description
                    }
                ]
            })

        expect(res.statusCode).toBe(401);
    });
});

// Add Product Promotion
// --------------------------
describe("POST /api/products/:product_id/new/promotion", () => {
    const postVariable1 = {
        promotion_price: 1234,
        active: true
    };

    // Test 1 - Create Single Promotion
    // Manual Test Success - 11/12/2020
    test("Can Successfully create a single new active product promotion", async () => {
        // Add a new promotion
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/promotion`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                promotion: {
                    promotion_price: postVariable1.promotion_price,
                    active: postVariable1.active
                }
        })

        // Check the previous promotion (which was active) is now set to false
        const originalPromoitionStatus = await db.query(`
            SELECT id, active FROM product_promotions
            WHERE id = $1`,
        [TEST_DATA.product.promotion.id])

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_promotions");
        expect(res.body.product_promotions).toHaveProperty("product_id");
        expect(res.body.product_promotions.product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_promotions).toHaveProperty("promotion_price");
        expect(res.body.product_promotions.promotion_price).toBe(postVariable1.promotion_price);
        expect(originalPromoitionStatus.rows[0].active).toBe(false);
    });


    // Test 2 - Rejection - Missing Required Information
    // Manual Test Success - 11/12/2020
    test("Rejection - Missing Required Information", async () => {
        // Add a new promotion
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/promotion`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                promotion: {
                    active: postVariable1.active
                }
        })

        expect(res.statusCode).toBe(400);
    });


    // Test 3 - Rejection - Negative Promotion Value
    // Manual Test Success - 11/12/2020
    test("Rejection - Negative Promotion Value", async () => {
        // Add a new promotion
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/promotion`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                promotion: {
                    promotion_price: -1234,
                    active: postVariable1.active
                }
        })

        expect(res.statusCode).toBe(400);
    });


    // Test 4 - Rejection - Promotion Value Above Base Product Value
    // Manual Test Success - 11/12/2020
    test("Rejection - Promotion Value Above Base Product Value", async () => {
        // Add a new promotion
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/promotion`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                promotion: {
                    promotion_price: (SOURCE_DATA_MERCHANT.testProductBase.base_price + 1),
                    active: postVariable1.active
                }
        })

        expect(res.statusCode).toBe(400);
    });

    // Test 5 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        // Add a new promotion
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/promotion`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                promotion: {
                    promotion_price: postVariable1.promotion_price,
                    active: postVariable1.active
                }
        })

        expect(res.statusCode).toBe(401);
    });
});

// Add Product Coupon
// --------------------------
describe("POST /api/products/:product_id/new/coupon", () => {
    const postVariable1 = {
        code: "NEWTESTCODE1",
        pct_discount: 0.19,
        active: true
    };

    const postVariable2 = {
        code: "NEWTESTCODE2",
        pct_discount: 0.29,
        active: false
    };

    // Test 1 - Single Coupon Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create a single new product coupon", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/coupon`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                coupons:  [
                    {
                        code: postVariable1.code,
                        pct_discount: postVariable1.pct_discount,
                        active: postVariable1.active
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_coupons");
        expect(res.body.product_coupons.length).toBe(1);
        expect(res.body.product_coupons[0]).toHaveProperty("product_id");
        expect(res.body.product_coupons[0].product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_coupons[0]).toHaveProperty("code");
        expect(res.body.product_coupons[0].code).toBe(postVariable1.code);
    });


    // Test 2 - Multiple Coupon Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create multiple new product coupon", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/coupon`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                coupons:  [
                    {
                        code: postVariable1.code,
                        pct_discount: postVariable1.pct_discount,
                        active: postVariable1.active
                    },
                    {
                        code: postVariable2.code,
                        pct_discount: postVariable2.pct_discount,
                        active: postVariable2.active
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_coupons");
        expect(res.body.product_coupons.length).toBe(2);
        expect(res.body.product_coupons[0]).toHaveProperty("product_id");
        expect(res.body.product_coupons[0]).toHaveProperty("code");
    });

    // Test 3 - Rejection - Missing Required Information
    // Manual Test Success - 11/12/2020
    test("Rejection - Missing Required Information", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/coupon`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                coupons:  [
                    {
                        pct_discount: postVariable1.pct_discount,
                        active: postVariable1.active
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Rejection - Code Length to Short (2 char)
    // Manual Test Success - 11/12/2020
    test("Rejection - Code Length to Short (2 char)", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/coupon`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                coupons:  [
                    {
                        code: "a",
                        pct_discount: postVariable1.pct_discount,
                        active: postVariable1.active
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 5 - Rejection - Code Incudes Illegal Characters (Only 0-9 a-Z allowed)
    // Note: Might need to change the default message, may be confusing as it returns the RegEx pattern
    // Manual Test Success - 11/12/2020
    test("Rejection - Code Incudes Illegal Characters (Only 0-9 a-Z allowed)", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/coupon`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                coupons:  [
                    {
                        code: "INV@L!DCODE",
                        pct_discount: postVariable1.pct_discount,
                        active: postVariable1.active
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 6 - Rejection - Negative Discount
    // Manual Test Success - 11/12/2020
    test("Rejection - Negative Discount", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/coupon`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                coupons:  [
                    {
                        code: postVariable1.code,
                        pct_discount: -0.1,
                        active: postVariable1.active
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 7 - Rejection - Greather than 100% (1) Discount
    // Manual Test Success - 11/12/2020
    test("Rejection - Greather than 100% (1) Discount", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/coupon`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                coupons:  [
                    {
                        code: postVariable1.code,
                        pct_discount: 1.1,
                        active: postVariable1.active
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 8 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/coupon`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                coupons:  [
                    {
                        code: postVariable1.code,
                        pct_discount: postVariable1.pct_discount,
                        active: postVariable1.active
                    }
                ]
            })

        expect(res.statusCode).toBe(401);
    });
});

// Add Product Modifier
// --------------------------
describe("POST /api/products/:product_id/new/modifier", () => {
    const postVariable1 = {
        name: "NewProductModifier1",
        description: "NewProductModifierDescription1"
    };

    const postVariable2 = {
        name: "NewProductModifier2",
        description: "NewProductModifierDescription2"
    };

    // Test 1 - Single Modifier Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create a single new product modifier", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/modifier`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                modifiers:  [
                    {
                        name: postVariable1.name,
                        description: postVariable1.description
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_modifiers");
        expect(res.body.product_modifiers.length).toBe(1);
        expect(res.body.product_modifiers[0]).toHaveProperty("product_id");
        expect(res.body.product_modifiers[0].product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_modifiers[0]).toHaveProperty("name");
        expect(res.body.product_modifiers[0].name).toBe(postVariable1.name);
    });

    // Test 2 - Multiple Product Modifier Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create multiple new product modifier", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/modifier`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                modifiers:  [
                    {
                        name: postVariable1.name,
                        description: postVariable1.description
                    },
                    {
                        name: postVariable2.name,
                        description: postVariable2.description
                    }
                ]
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_modifiers");
        expect(res.body.product_modifiers.length).toBe(2);
        expect(res.body.product_modifiers[0]).toHaveProperty("product_id");
        expect(res.body.product_modifiers[0]).toHaveProperty("name");
    });

    // Test 3 - Rejection - Missing Required Information
    // Manual Test Success - 11/12/2020
    test("Rejection - Missing Required Information", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/modifier`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                modifiers:  [
                    {
                        name: postVariable1.name
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Rejection - Name Length to Short (1 char)
    // Manual Test Success - 11/12/2020
    test("Rejection - Name Length to Short (1 char)", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/modifier`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                modifiers:  [
                    {
                        name: "",
                        description: postVariable1.description
                    }
                ]
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 5 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/modifier`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                modifiers:  [
                    {
                        name: postVariable1.name,
                        description: postVariable1.description
                    }
                ]
            })

        expect(res.statusCode).toBe(401);
    });
});

// Add Product Review
// --------------------------
describe("POST /api/products/:product_id/new/review", () => {
    const postVariable1 = {
        rating: 3,
        title: "NewProductReviewTitle",
        body: "NewProductReviewBody"
    };

    // Test 1 - Review Creation
    // Manual Test Success - 11/12/2020
    test("Can Successfully create a new product review", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/review`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                review: {
                    rating: postVariable1.rating,
                    title:  postVariable1.title,
                    body:  postVariable1.body
                }
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_reviews");
        expect(res.body.product_reviews).toHaveProperty("product_id");
        expect(res.body.product_reviews.product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_reviews).toHaveProperty("title");
        expect(res.body.product_reviews.title).toBe(postVariable1.title);
    });

    // Test 2 - Rejection - Missing Required Information
    // Manual Test Success - 11/12/2020
    test("Rejection - Missing Required Information", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/review`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                review: {
                    title:  postVariable1.title,
                    body:  postVariable1.body
                }
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Rejection - Non-Integer Type for Rating
    // Manual Test Success - 11/12/2020
    test("Rejection - Non-Integer Type for Rating", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/review`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                review: {
                    rating: "good",
                    title:  postVariable1.title,
                    body:  postVariable1.body
                }
            })

        expect(res.statusCode).toBe(400);
    });


    // Test 4 - Rejection - Rating Out of Bounds (1-5)
    // Manual Test Success - 11/12/2020
    test("Rejection - Rating Out of Bounds (1-5)", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/review`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                review: {
                    rating: 10,
                    title:  postVariable1.title,
                    body:  postVariable1.body
                }
            })

        expect(res.statusCode).toBe(400);
    });


    // Test 5 - Rejection - Not a Buying User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Purchasing Enabled User", async () => {
        const res = await request(app)
            .post(`/api/products/${TEST_DATA.product.id}/new/review`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                review: {
                    rating: postVariable1.rating,
                    title:  postVariable1.title,
                    body:  postVariable1.body
                }
            })

        expect(res.statusCode).toBe(401);
    });

});


// ======================
// ----  READ TESTS  ----
// ======================
// Get Product Details
// --------------------------
describe("GET /api/products/catalog/:product_id", () => {
    // Test 1 - Can retrieve full product details
    // Manual Test Success - 11/12/2020
    test("Can retrieve full product details", async () => {
        const res = await request(app)
            .get(`/api/products/catalog/${TEST_DATA.product.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product");
        expect(res.body.product).toHaveProperty("base_price");
        expect(res.body.product).toHaveProperty("images");
        expect(res.body.product).toHaveProperty("modifiers");
        expect(res.body.product).toHaveProperty("promotion");
        expect(res.body.product).toHaveProperty("reviews");
    });

    // Test 2 - Returns 404 on product not found
    // Manual Test Success - 11/12/2020
    test("Returns 404 on product not found", async () => {
        const res = await request(app)
            .get(`/api/products/catalog/0`);

        expect(res.statusCode).toBe(404);
    });
});

// Get Catalog
// --------------------------
describe("GET /api/products/catalog/:product_id", () => {
    // Test 1 - Can retrieve product catalogue no search parameters
    // Manual Test Success - 11/12/2020
    test("Can retrieve full product details", async () => {
        const res = await request(app)
            .get(`/api/products/catalog`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("products");
        expect(res.body).toHaveProperty("metas");
        expect(res.body).toHaveProperty("features");
        expect(res.body.products[0]).toHaveProperty("name");
        expect(res.body.metas[0]).toHaveProperty("title");
    });

    // Test 2 - Can retrieve products by name search string
    // Manual Test Success - 11/12/2020
    test("Can retrieve products by name search string", async () => {
        const resSuccess = await request(app)
            .get(`/api/products/catalog?s=${SOURCE_DATA_MERCHANT.testProductBase.name}`);

        const resEmpty = await request(app)
        .get(`/api/products/catalog?s=NonExistentProductName`);

        expect(resSuccess.statusCode).toBe(200);
        expect(resSuccess.body).toHaveProperty("products");
        expect(resSuccess.body).toHaveProperty("metas");
        expect(resSuccess.body).toHaveProperty("features");
        expect(resSuccess.body.products[0]).toHaveProperty("name");
        expect(resSuccess.body.metas[0]).toHaveProperty("title");

        expect(resEmpty.statusCode).toBe(200);
        expect(resEmpty.body).toHaveProperty("products");
        expect(resEmpty.body).toHaveProperty("metas");
        expect(resEmpty.body).toHaveProperty("features");
        expect(resEmpty.body.products.length).toBe(0);
        expect(resEmpty.body.metas.length).toBe(0);
    });

    // Test 3 - Can retrieve products by tag data
    // Manual Test Success - 11/12/2020
    test("Can retrieve products by tag search", async () => {
        const resSuccess = await request(app)
            .get(`/api/products/catalog?t=${SOURCE_DATA_MERCHANT.testProductMeta.title}`);

        const resEmpty = await request(app)
        .get(`/api/products/catalog?t=NonExistentProductTag`);

        expect(resSuccess.statusCode).toBe(200);
        expect(resSuccess.body).toHaveProperty("products");
        expect(resSuccess.body).toHaveProperty("metas");
        expect(resSuccess.body).toHaveProperty("features");
        expect(resSuccess.body.products[0]).toHaveProperty("name");
        expect(resSuccess.body.metas[0]).toHaveProperty("title");

        expect(resEmpty.statusCode).toBe(200);
        expect(resEmpty.body).toHaveProperty("products");
        expect(resEmpty.body).toHaveProperty("metas");
        expect(resEmpty.body).toHaveProperty("features");
        expect(resEmpty.body.products.length).toBe(0);
        expect(resEmpty.body.metas.length).toBe(0);
    });

    // Test 4 - Can retrieve products by rating data
    // Manual Test Success - 11/12/2020
    test("Can retrieve products by rating data", async () => {
        const resSuccess = await request(app)
            .get(`/api/products/catalog?r=${SOURCE_DATA_MERCHANT.testProductBase.avg_rating - 1}`);

        const resEmpty = await request(app)
        .get(`/api/products/catalog?r=5`);

        expect(resSuccess.statusCode).toBe(200);
        expect(resSuccess.body).toHaveProperty("products");
        expect(resSuccess.body).toHaveProperty("metas");
        expect(resSuccess.body).toHaveProperty("features");
        expect(resSuccess.body.products[0]).toHaveProperty("name");
        expect(resSuccess.body.metas[0]).toHaveProperty("title");

        expect(resEmpty.statusCode).toBe(200);
        expect(resEmpty.body).toHaveProperty("products");
        expect(resEmpty.body).toHaveProperty("metas");
        expect(resEmpty.body).toHaveProperty("features");
        expect(resEmpty.body.products.length).toBe(0);
        expect(resEmpty.body.metas.length).toBe(0);
    });

    // Test 5 - Can retrieve products with multiple filters
    // Manual Test Success - 11/12/2020
    test("Can retrieve products by name multiple filters", async () => {
        const resSuccess = await request(app)
            .get(`/api/products/catalog?s=${SOURCE_DATA_MERCHANT.testProductBase.name}&t=${SOURCE_DATA_MERCHANT.testProductMeta.title}`);

        const resEmpty = await request(app)
        .get(`/api/products/catalog?s=NonExistentProductName&t=${SOURCE_DATA_MERCHANT.testProductMeta.title}`);

        expect(resSuccess.statusCode).toBe(200);
        expect(resSuccess.body).toHaveProperty("products");
        expect(resSuccess.body).toHaveProperty("metas");
        expect(resSuccess.body).toHaveProperty("features");
        expect(resSuccess.body.products[0]).toHaveProperty("name");
        expect(resSuccess.body.metas[0]).toHaveProperty("title");

        expect(resEmpty.statusCode).toBe(200);
        expect(resEmpty.body).toHaveProperty("products");
        expect(resEmpty.body).toHaveProperty("metas");
        expect(resEmpty.body).toHaveProperty("features");
        expect(resEmpty.body.products.length).toBe(0);
        expect(resEmpty.body.metas.length).toBe(0);
    });
});


// ======================
// ---- UPDATE TESTS ----
// ======================
// Update Product
// --------------------------
describe("PATCH /api/products/:product_id", () => {
    const patchVariable = {
        name: "UpdatedProductName1",
        description: "UpdatedProductDescription1",
        base_price: 8888
    };

    // Test 1 - Product Update
    // Manual Test Success - 11/12/2020
    test("Can Successfully update a product", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                name: patchVariable.name
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product");
        expect(res.body.product).toHaveProperty("merchant_id");
        expect(res.body.product.merchant_id).toBe(TEST_DATA.merchantDetails.id);
        expect(res.body.product).toHaveProperty("name");
        expect(res.body.product.name).toBe(patchVariable.name);
        expect(res.body.product.description).toBe(TEST_DATA.product.description);
    });


    // Test 2 - Rejection - Negative Value for Price
    // Manual Test Success - 11/12/2020
    test("Rejection - Negative Value for Price", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                name: patchVariable.name,
                base_price: -9999
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Rejection - Min Length Title / Description Violation
    // Manual Test Success - 11/12/2020
    test("Rejection - Min Length Title / Description Violation", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                name: "",
                description: "",
                base_price: patchVariable.base_price
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                base_price: patchVariable.base_price
            })

        expect(res.statusCode).toBe(401);
    });
});

// Update Product Image
// --------------------------
describe("PATCH /api/products/:product_id/img/:image_id", () => {
    const patchVariable = {
        url: "https://imageProviderService.com/updatedproductimage1",
        alt_text: "UpdatedProductImage1",
        weight: 10
    };

    // Test 1 - Update Product Image
    // Manual Test Success - 11/12/2020
    test("Can Successfully update product image", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/img/${TEST_DATA.product.image.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                url: patchVariable.url
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_image");
        expect(res.body.product_image).toHaveProperty("product_id");
        expect(res.body.product_image.product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_image).toHaveProperty("url");
        expect(res.body.product_image.url).toBe(patchVariable.url);
        expect(res.body.product_image).toHaveProperty("alt_text");
        expect(res.body.product_image.alt_text).toBe(TEST_DATA.product.image.alt_text);
    });

    // Test 2 - Rejection - Value outside of Weight Bounds
    // Manual Test Success - 11/12/2020
    test("Rejection - Value outside of Weight Bounds", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/img/${TEST_DATA.product.image.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                url: patchVariable.url,
                weight: -1
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Rejection - Invalid url
    // Manual Test Success - 11/12/2020
    test("Rejection - Invalid url", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/img/${TEST_DATA.product.image.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                url: "thisisnotaurl",
                weight: patchVariable.weight
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Rejection - Alt Text to Short
    // Manual Test Success - 11/12/2020
    test("Rejection - Alt Text to Short", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/img/${TEST_DATA.product.image.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                alt_text: "",
                weight: patchVariable.weight
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 5 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Alt Text to Short", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/img/${TEST_DATA.product.image.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                alt_text: patchVariable.alt_text,
                weight: patchVariable.weight
            })

        expect(res.statusCode).toBe(401);
    });
});

// Update Product Meta Data
// --------------------------
describe("PATCH /api/products/:product_id/meta/:meta_id", () => {
    const patchVariable = {
        title: "UpdatedMetaTitle1",
        description: "UpdatedMetaDescription1"
    };

    // Test 1 - Update Meta
    // Manual Test Success - 11/12/2020
    test("Can Successfully update product meta", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/meta/${TEST_DATA.product.meta.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                title: patchVariable.title
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_meta");
        expect(res.body.product_meta).toHaveProperty("product_id");
        expect(res.body.product_meta.product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_meta).toHaveProperty("title");
        expect(res.body.product_meta.title).toBe(patchVariable.title);
        expect(res.body.product_meta).toHaveProperty("description");
        expect(res.body.product_meta.description).toBe(TEST_DATA.product.meta.description);
    });

    // Test 2 - Rejection - Name Length to Short (1 char)
    // Manual Test Success - 11/12/2020
    test("Rejection - Title Length to Short (1 char)", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/meta/${TEST_DATA.product.meta.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                title: "",
                description: patchVariable.description
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/meta/${TEST_DATA.product.meta.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                description: patchVariable.description
            })

        expect(res.statusCode).toBe(401);
    });
});

// Update Product Promotion
// --------------------------
describe("PATCH /api/products/:product_id/promotion/:promotion_id", () => {
    const patchVariable = {
        promotion_price: 4321,
        active: false
    };

    // Test 1 - Promotion Update
    // Manual Test Success - 11/12/2020
    test("Can Successfully update a product promotion", async () => {
        // Add a new promotion
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/promotion/${TEST_DATA.product.promotion.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                promotion_price: patchVariable.promotion_price
        })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_promotion");
        expect(res.body.product_promotion).toHaveProperty("product_id");
        expect(res.body.product_promotion.product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_promotion).toHaveProperty("promotion_price");
        expect(res.body.product_promotion.promotion_price).toBe(patchVariable.promotion_price);
        expect(res.body.product_promotion).toHaveProperty("active");
        expect(res.body.product_promotion.active).toBe(TEST_DATA.product.promotion.active);
    });

    // Test 2 - Rejection - Negative Promotion Value
    // Manual Test Success - 11/12/2020
    test("Rejection - Negative Promotion Value", async () => {
        // Add a new promotion
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/promotion/${TEST_DATA.product.promotion.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                promotion_price: -1000
        })

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Rejection - Promotion Value Greater Then Base Value
    // Manual Test Success - 11/12/2020
    test("Rejection - Promotion Value Greater Then Base Value", async () => {
        // Add a new promotion
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/promotion/${TEST_DATA.product.promotion.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                promotion_price: TEST_DATA.product.base_price + 1
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Promotion Value Greater Then Base Value", async () => {
        // Add a new promotion
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/promotion/${TEST_DATA.product.promotion.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                promotion_price: patchVariable.promotion_price
            })

        expect(res.statusCode).toBe(401);
    });
});

// Update Product Coupon
// --------------------------
describe("PATCH /api/products/:product_id/coupon/:coupon_id", () => {
    const patchVariable = {
        code: "UPDATEDTESTCODE1",
        pct_discount: 0.39,
        active: false
    };

    // Test 1 - Update Coupon
    // Manual Test Success - 11/12/2020
    test("Can Successfully update a product coupon", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/coupon/${TEST_DATA.product.coupon.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                code: patchVariable.code
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_coupon");
        expect(res.body.product_coupon).toHaveProperty("product_id");
        expect(res.body.product_coupon.product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_coupon).toHaveProperty("code");
        expect(res.body.product_coupon.code).toBe(patchVariable.code);
        expect(res.body.product_coupon).toHaveProperty("pct_discount");
        expect(res.body.product_coupon.pct_discount).toBe(TEST_DATA.product.coupon.pct_discount);
    });

    // Test 2 - Rejection - Code Length to Short (2 char)
    // Manual Test Success - 11/12/2020
    test("Rejection - Code Length to Short (2 char)", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/coupon/${TEST_DATA.product.coupon.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                code: "a",
                pct_discount: patchVariable.pct_discount
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Rejection - Code Incudes Illegal Characters (Only 0-9 a-Z allowed)
    // Note: Might need to change the default message, may be confusing as it returns the RegEx pattern
    // Manual Test Success - 11/12/2020
    test("Rejection - Code Length to Short (2 char)", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/coupon/${TEST_DATA.product.coupon.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                code: "a",
                pct_discount: patchVariable.pct_discount
            })

        expect(res.statusCode).toBe(400);
    });


    // Test 4 - Rejection - Negative Discount
    // Manual Test Success - 11/12/2020
    test("Rejection - Code Incudes Illegal Characters (Only 0-9 a-Z allowed)", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/coupon/${TEST_DATA.product.coupon.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                code: "ILLEG@LCHAR$",
                pct_discount: patchVariable.pct_discount
            })

        expect(res.statusCode).toBe(400);
    });


    // Test 5 - Rejection - Greater than 100% (1) Discount
    // Manual Test Success - 11/12/2020
    test("Rejection - Greater than 100% (1) Discount", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/coupon/${TEST_DATA.product.coupon.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                code: patchVariable.code,
                pct_discount: 1.1
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 6 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/coupon/${TEST_DATA.product.coupon.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                code: patchVariable.code,
                pct_discount: patchVariable.pct_discount
            })

        expect(res.statusCode).toBe(401);
    });
});

// Update Product Modifier
// --------------------------
describe("PATCH /api/products/:product_id/modifier/:modifier_id", () => {
    const patchVariable = {
        name: "UpdatedProductModifier1",
        description: "UpdatedProductModifierDescription1"
    };

    // Test 1 - Update Modifier
    // Manual Test Success - 11/12/2020
    test("Can Successfully update product modifier", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/modifier/${TEST_DATA.product.modifier.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                name: patchVariable.name
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_modifier");
        expect(res.body.product_modifier).toHaveProperty("product_id");
        expect(res.body.product_modifier.product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_modifier).toHaveProperty("name");
        expect(res.body.product_modifier.name).toBe(patchVariable.name);
        expect(res.body.product_modifier).toHaveProperty("description");
        expect(res.body.product_modifier.description).toBe(TEST_DATA.product.modifier.description);
    });

    // Test 2 - Rejection - Name Length to Short (1 char)
    // Manual Test Success - 11/12/2020
    test("Rejection - Name Length to Short (1 char)", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/modifier/${TEST_DATA.product.modifier.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                name: "",
                description: patchVariable.description
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/modifier/${TEST_DATA.product.modifier.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                description: patchVariable.description
            })

        expect(res.statusCode).toBe(401);
    });
});


// Update Product Review
// --------------------------
describe("PATCH /api/products/:product_id/review/:review_id", () => {
    const patchVariable = {
        rating: 1,
        title: "UpdateProductReviewTitle",
        body: "UpdateProductReviewBody"
    };

    // Test 1 - Review Update
    // Manual Test Success - 11/12/2020
    test("Can Successfully create a new product review", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/review/${TEST_DATA.product.review.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                title:  patchVariable.title
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("product_review");
        expect(res.body.product_review).toHaveProperty("product_id");
        expect(res.body.product_review.product_id).toBe(TEST_DATA.product.id);
        expect(res.body.product_review).toHaveProperty("title");
        expect(res.body.product_review.title).toBe(patchVariable.title);
        expect(res.body.product_review).toHaveProperty("body");
        expect(res.body.product_review.body).toBe(TEST_DATA.product.review.body);
    });

    // Test 2 - Rejection - Non-Integer Type for Rating
    // Manual Test Success - 11/12/2020
    test("Rejection - Non-Integer Type for Rating", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/review/${TEST_DATA.product.review.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                rating: "good",
                title:  patchVariable.title
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 3 - Rejection - Rating Out of Bounds (1-5)
    // Manual Test Success - 11/12/2020
    test("Rejection - Rating Out of Bounds (1-5)", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/review/${TEST_DATA.product.review.id}`)
            .set("Cookie", TEST_DATA.userCookies)
            .send({
                rating: 8,
                title:  patchVariable.title
            })

        expect(res.statusCode).toBe(400);
    });

    // Test 4 - Rejection - Not a Buying User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Buying User", async () => {
        const res = await request(app)
            .patch(`/api/products/${TEST_DATA.product.id}/review/${TEST_DATA.product.review.id}`)
            .set("Cookie", TEST_DATA.merchantCookies)
            .send({
                title:  patchVariable.title
            })

        expect(res.statusCode).toBe(401);
    });
});


// ======================
// ---- DELETE TESTS ----
// ======================
// Delete Product
describe("DELETE /api/products/:product_id", () => {
    // Test 1 - Delete Success
    // Manual Test Success - 11/12/2020
    test("Can Successfully delete a product", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Product deleted");
    });

    // Test 2 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });
});


// Delete Product Image
describe("DELETE /api/products/:product_id/img/:image_id", () => {
    // Test 1 - Delete Success
    // Manual Test Success - 11/12/2020
    test("Can Successfully delete a product image", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/img/${TEST_DATA.product.image.id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Product Image deleted");
    });

    // Test 2 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/img/${TEST_DATA.product.image.id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });
});




// Delete Product Meta Data
describe("DELETE /api/products/:product_id/meta/:meta_id", () => {
    // Test 1 - Delete Success
    // Manual Test Success - 11/12/2020
    test("Can Successfully delete a product image", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/meta/${TEST_DATA.product.meta.id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Product Meta deleted");
    });

    // Test 2 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/meta/${TEST_DATA.product.meta.id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });
});


// Delete Product Promotion
describe("DELETE /api/products/:product_id/promotion/:promotion_id", () => {
    // Test 1 - Delete Success
    // Manual Test Success - 11/12/2020
    test("Can Successfully delete a product image", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/promotion/${TEST_DATA.product.promotion.id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Product Promotion deleted");
    });

    // Test 2 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/promotion/${TEST_DATA.product.promotion.id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });
});


// Delete Product Coupon
describe("DELETE /api/products/:product_id/coupon/:coupon_id", () => {
    // Test 1 - Delete Success
    // Manual Test Success - 11/12/2020
    test("Can Successfully delete a product image", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/coupon/${TEST_DATA.product.coupon.id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Product Coupon deleted");
    });

    // Test 2 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/coupon/${TEST_DATA.product.coupon.id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });
});


// Delete Product Modifier
describe("DELETE /api/products/:product_id/modifier/:modifier_id", () => {
    // Test 1 - Delete Success
    // Manual Test Success - 11/12/2020
    test("Can Successfully delete a product image", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/modifier/${TEST_DATA.product.modifier.id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Product Modifier deleted");
    });

    // Test 2 - Rejection - Not a Merchant User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not a Merchant User", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/modifier/${TEST_DATA.product.modifier.id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(401);
    });
});



// Delete Product Review
describe("DELETE /api/products/:product_id/review/:review_id", () => {
    // Test 1 - Delete Success
    // Manual Test Success - 11/12/2020
    test("Can Successfully delete a product image", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/review/${TEST_DATA.product.review.id}`)
            .set("Cookie", TEST_DATA.userCookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Product Review deleted");
    });

    // Test 2 - Rejection - Not the Buying User
    // Manual Test Success - 11/12/2020
    test("Rejection - Not the Buying User", async () => {
        const res = await request(app)
            .delete(`/api/products/${TEST_DATA.product.id}/review/${TEST_DATA.product.review.id}`)
            .set("Cookie", TEST_DATA.merchantCookies);

        expect(res.statusCode).toBe(401);
    });
});
