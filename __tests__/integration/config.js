process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");
const bcrypt = require("bcrypt");

// app imports
const app = require("../../app");
const db = require("../../db");

// Data for the main merchant
const SOURCE_DATA_MERCHANT = {
    testMerchant: {
        email: "StaticWaterCorp@test.com",
        display_name: "Static Water Corp",
        password: "passwordpassword"
    },
    testMerchantAbout: {
        headline: "We Make Static Water!",
        about: "Primary producer of Static Water World-Wide",
        logo_wide_url: "https://imageHost.com/imageofstaticwaterlogowide",
        logo_narrow_url: "https://imageHost.com/imageofstaticwaterlogonarrow"
    },
    testProductBase: {
        name: "StaticWater",
        description: "StaticWater_Description",
        base_price: 9999,
        avg_rating: 5,
        qty_ratings: 1,
        qty_views: 10,
        qty_purchases: 5,
        qty_returns: 1
    },
    testProductImage: {
        url: "https://imageHost.com/imageofstaticwater1",
        alt_text: "Image of Static Water 1",
        weight: 1
    },
    testProductMeta: {
        title: "UniqueMetaTag",
        description: "Meta tag providing additional details for Static Water 1"
    },
    testProductPromotion: {
        promotion_price: 5555,
        active: true
    },
    testProductCoupon: {
        code: "STATIC20PCT",
        pct_discount: 0.2,
        active: true
    },
    testProductModifier: {
        name: "Extra",
        description: "Quantity of Static"
    },
    testGathering: {
        title: "The Big Static Meetup",
        description: "For all the fans of static water out there",
        link: "https://gatheringService.com/bigstaticmeetup1",
        gathering_dt: "2020-12-10T18:00:00Z"
    }
};

// Data for the main user
const SOURCE_DATA_USER = {
    testUser: {
        email: "MrStaticShock@test.com",
        first_name: "Static",
        last_name: "Shock",
        password: "password"
    },
    testProductReview: {
        rating: 5,
        title: "My Review of Static Water",
        body: "The Extra Static Water had to much Static in it for me.",
        review_dt: "2020-12-10T18:00:00Z"
    },
    testOrder: {
        order: {
            order_total: 8888,
            remote_payment_id: "1234RanDomCharacTERString",
            remote_payment_dt: "2020-12-10T18:00:00Z",
            remote_order_id: "1234RanDomCharacTERString",
            remote_receipt_id: "1234",
            remote_receipt_url: "https://receiptwebsit.com/receipt/preview/1234RanDomCharacTERString"
        },
        order_product: {
            product_name: SOURCE_DATA_MERCHANT.testProductBase.name,
            quantity: 2,
            base_price: SOURCE_DATA_MERCHANT.testProductBase.base_price,
            promotion_price: SOURCE_DATA_MERCHANT.testProductPromotion.promotion_price,
            coupon_discount: SOURCE_DATA_MERCHANT.testProductCoupon.pct_discount,
            final_price: 8888,
            modifier_name: SOURCE_DATA_MERCHANT.testProductModifier.name
        },
        order_coupon: {
            coupon_code: SOURCE_DATA_MERCHANT.testProductCoupon.code,
            pct_discount: SOURCE_DATA_MERCHANT.testProductCoupon.pct_discount
        },
        order_promotion: {
            promotion_price: SOURCE_DATA_MERCHANT.testProductPromotion.promotion_price
        }
    }
};

// Data for additional users (delta checks)
const ADDITIONAL_USERS = {
    testMerchant2: {
        email: "TestMerchant2@test.com",
        display_name: "Test Merchant 2 Corp",
        password: "passwordpassword"
    },
    testUser2: {
        email: "TestUser2@test.com",
        first_name: "Test2",
        last_name: "User2",
        password: "password"
    },
};

const TEST_DATA = {};

async function beforeAllHook() {

}

/**
 * Hooks to insert a user, company, and job, and to authenticate
 *  the user and the company for respective tokens that are stored
 *  in the input `testData` parameter.
 * @param {Object} TEST_DATA - build the TEST_DATA object
 */
async function beforeEachHook(TEST_DATA) {
    try {
        // ------------------------------ Merchant Test Data Creation ---------------------------------
        // create a merchant, log the merchant in, get verification cookies, store the merchant details & cookies
        const hashedPasswordMerchant = await bcrypt.hash(SOURCE_DATA_MERCHANT.testMerchant.password, 1);
        const merchantDetails = await db.query(
            `INSERT INTO merchants (email, password, display_name)
                VALUES ($1, $2, $3)
            RETURNING *`,
            [
                SOURCE_DATA_MERCHANT.testMerchant.email, 
                hashedPasswordMerchant, 
                SOURCE_DATA_MERCHANT.testMerchant.display_name
            ]
        );

        const responseMerchant = await request(app)
            .post("/api/auth/merchant")
            .send({
                email: SOURCE_DATA_MERCHANT.testMerchant.email,
                password: SOURCE_DATA_MERCHANT.testMerchant.password,
        });

        TEST_DATA.merchantCookies = responseMerchant.get("Set-Cookie");
        TEST_DATA.merchantDetails = merchantDetails.rows[0];

        // create data for merchant about page for newly created merchant
        const merchantAbout = await db.query(
            `INSERT INTO merchant_about (merchant_id, headline, about, logo_wide_url, logo_narrow_url)
                VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                TEST_DATA.merchantDetails.id,
                SOURCE_DATA_MERCHANT.testMerchantAbout.headline,
                SOURCE_DATA_MERCHANT.testMerchantAbout.about,
                SOURCE_DATA_MERCHANT.testMerchantAbout.logo_wide_url,
                SOURCE_DATA_MERCHANT.testMerchantAbout.logo_narrow_url
            ]
        );
        TEST_DATA.merchantDetails.about = merchantAbout.rows[0];


        // ------------------------------- User Test Data Creation -----------------------------------
        // create a user, log the user in, get verification cookies, store the user details & cookies
        const hashedPasswordUser = await bcrypt.hash(SOURCE_DATA_USER.testUser.password, 1);
        const userDetails = await db.query(
            `INSERT INTO users (email, password, first_name, last_name)
                VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                SOURCE_DATA_USER.testUser.email, 
                hashedPasswordUser, 
                SOURCE_DATA_USER.testUser.first_name, 
                SOURCE_DATA_USER.testUser.last_name
            ]
        );

        const responseUser = await request(app)
            .post("/api/auth/user")
            .send({
                email: SOURCE_DATA_USER.testUser.email,
                password: SOURCE_DATA_USER.testUser.password,
        });

        TEST_DATA.userCookies = responseUser.get("Set-Cookie");
        TEST_DATA.userDetails = userDetails.rows[0];

        // ------------------------------ Product Test Data Creation ---------------------------------
        // create a product for the newly created merchant
        const productBase = await db.query(
            `INSERT INTO products (merchant_id, name, description, base_price, avg_rating, qty_ratings, qty_views, qty_purchases, qty_returns)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                TEST_DATA.merchantDetails.id,
                SOURCE_DATA_MERCHANT.testProductBase.name,
                SOURCE_DATA_MERCHANT.testProductBase.description,
                SOURCE_DATA_MERCHANT.testProductBase.base_price,
                SOURCE_DATA_MERCHANT.testProductBase.avg_rating,
                SOURCE_DATA_MERCHANT.testProductBase.qty_ratings,
                SOURCE_DATA_MERCHANT.testProductBase.qty_views,
                SOURCE_DATA_MERCHANT.testProductBase.qty_purchases,
                SOURCE_DATA_MERCHANT.testProductBase.qty_returns
            ]
        );
        TEST_DATA.product = productBase.rows[0];

        // create image for the newly created product
        const productImage = await db.query(
            `INSERT INTO product_images (product_id, url, alt_text, weight)
                VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                TEST_DATA.product.id,
                SOURCE_DATA_MERCHANT.testProductImage.url,
                SOURCE_DATA_MERCHANT.testProductImage.alt_text,
                SOURCE_DATA_MERCHANT.testProductImage.weight
            ]
        );
        TEST_DATA.product.image = productImage.rows[0];

        // create meta tag for the newly created product
        const productMeta = await db.query(
            `INSERT INTO product_meta (product_id, title, description)
                VALUES ($1, $2, $3)
            RETURNING *`,
            [
                TEST_DATA.product.id,
                SOURCE_DATA_MERCHANT.testProductMeta.title,
                SOURCE_DATA_MERCHANT.testProductMeta.description
            ]
        )
        TEST_DATA.product.meta = productMeta.rows[0];

        // create promotion for the newly created product
        const productPromotion = await db.query(
            `INSERT INTO product_promotions (product_id, promotion_price, active)
                VALUES ($1, $2, $3)
            RETURNING *`,
            [
                TEST_DATA.product.id,
                SOURCE_DATA_MERCHANT.testProductPromotion.promotion_price,
                SOURCE_DATA_MERCHANT.testProductPromotion.active
            ]
        )
        TEST_DATA.product.promotion = productPromotion.rows[0];

        // create coupon for the newly created product
        const productCoupon = await db.query(
            `INSERT INTO product_coupons (product_id, code, pct_discount, active)
                VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                TEST_DATA.product.id,
                SOURCE_DATA_MERCHANT.testProductCoupon.code,
                SOURCE_DATA_MERCHANT.testProductCoupon.pct_discount,
                SOURCE_DATA_MERCHANT.testProductCoupon.active
            ]
        )
        TEST_DATA.product.coupon = productCoupon.rows[0];

        // create modifier for the newly created product
        const productModifier = await db.query(
            `INSERT INTO product_modifiers (product_id, name, description)
                VALUES ($1, $2, $3)
            RETURNING *`,
            [
                TEST_DATA.product.id,
                SOURCE_DATA_MERCHANT.testProductModifier.name,
                SOURCE_DATA_MERCHANT.testProductModifier.description
            ]
        )
        TEST_DATA.product.modifier = productModifier.rows[0];

        const productReview = await db.query(
            `INSERT INTO product_reviews (product_id, user_id, rating, title, body, review_dt)
                VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                TEST_DATA.product.id,
                TEST_DATA.userDetails.id,
                SOURCE_DATA_USER.testProductReview.rating,
                SOURCE_DATA_USER.testProductReview.title,
                SOURCE_DATA_USER.testProductReview.body,
                SOURCE_DATA_USER.testProductReview.review_dt
            ]
        )

        TEST_DATA.product.review = productReview.rows[0];

        // ------------------------------ Gathering Test Data Creation --------------------------------
        // create gathering for newly created merchant
        const gathering = await db.query(
            `INSERT INTO gatherings (merchant_id, title, description, link, gathering_dt)
                VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                TEST_DATA.merchantDetails.id,
                SOURCE_DATA_MERCHANT.testGathering.title,
                SOURCE_DATA_MERCHANT.testGathering.description,
                SOURCE_DATA_MERCHANT.testGathering.link,
                SOURCE_DATA_MERCHANT.testGathering.gathering_dt
            ]
        );
        TEST_DATA.gathering = gathering.rows[0];

        // Link gathering to merchant
        await db.query(
            `INSERT INTO gathering_merchants (gathering_id, merchant_id)
                VALUES ($1, $2)`,
            [
                TEST_DATA.gathering.id,
                TEST_DATA.merchantDetails.id
            ]
        )

        // -------------------------------- Order Test Data Creation ---------------------------------
        // create order for newly created user
        const orderBase = await db.query(
            `INSERT INTO orders (user_id, order_total, remote_payment_id, remote_payment_dt, remote_order_id, remote_receipt_id, remote_receipt_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                TEST_DATA.userDetails.id,
                SOURCE_DATA_USER.testOrder.order.order_total,
                SOURCE_DATA_USER.testOrder.order.remote_payment_id,
                SOURCE_DATA_USER.testOrder.order.remote_payment_dt,
                SOURCE_DATA_USER.testOrder.order.remote_order_id,
                SOURCE_DATA_USER.testOrder.order.remote_receipt_id,
                SOURCE_DATA_USER.testOrder.order.remote_receipt_url
            ]
        );
        TEST_DATA.order = orderBase.rows[0];

        // create products for newly created order
        const orderProduct = await db.query(
            `INSERT INTO order_products (order_id, product_id, product_name, quantity, base_price, promotion_price, coupon_discount, final_price, modifier_id, modifier_name)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [
                TEST_DATA.order.id,
                TEST_DATA.product.id,
                SOURCE_DATA_USER.testOrder.order_product.product_name,
                SOURCE_DATA_USER.testOrder.order_product.quantity,
                SOURCE_DATA_USER.testOrder.order_product.base_price,
                SOURCE_DATA_USER.testOrder.order_product.promotion_price,
                SOURCE_DATA_USER.testOrder.order_product.coupon_discount,
                SOURCE_DATA_USER.testOrder.order_product.final_price,
                TEST_DATA.product.modifier.id,
                SOURCE_DATA_USER.testOrder.order_product.modifier_name
            ]
        );
        TEST_DATA.order.product = orderProduct.rows[0];

        // create applied coupons for newly created order
        const orderCoupon = await db.query(
            `INSERT INTO order_coupons (order_id, product_id, coupon_id, coupon_code, pct_discount)
                VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                TEST_DATA.order.id,
                TEST_DATA.product.id,
                TEST_DATA.product.coupon.id,
                SOURCE_DATA_USER.testOrder.order_coupon.coupon_code,
                SOURCE_DATA_USER.testOrder.order_coupon.pct_discount
            ]
        );
        TEST_DATA.order.coupon = orderCoupon.rows[0];

        // create applied coupons for newly created order
        const orderPromotions = await db.query(
            `INSERT INTO order_promotions (order_id, product_id, promotion_id, promotion_price)
                VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                TEST_DATA.order.id,
                TEST_DATA.product.id,
                TEST_DATA.product.promotion.id,
                SOURCE_DATA_USER.testOrder.order_promotion.promotion_price
            ]
        );
        TEST_DATA.order.promotion = orderPromotions.rows[0];
        

        // ----------------------- Additional Users/Merchants Data Inserts ---------------------------
        const merchant2passwordhash = await bcrypt.hash(ADDITIONAL_USERS.testMerchant2.password, 1);
        await db.query(
            `INSERT INTO merchants (email, password, display_name)
                VALUES ($1, $2, $3)
            RETURNING *`,
            [
                ADDITIONAL_USERS.testMerchant2.email, 
                merchant2passwordhash, 
                ADDITIONAL_USERS.testMerchant2.display_name
            ]
        );

        const user2passwordhash = await bcrypt.hash(ADDITIONAL_USERS.testUser2.password, 1);
        await db.query(
            `INSERT INTO users (email, password, first_name, last_name)
                VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                ADDITIONAL_USERS.testUser2.email, 
                user2passwordhash, 
                ADDITIONAL_USERS.testUser2.first_name, 
                ADDITIONAL_USERS.testUser2.last_name
            ]
        );



    } catch (error) {
        console.error(error);
    }
}

async function afterEachHook() {
    try {
        await db.query("DELETE FROM gatherings");
        await db.query("DELETE FROM order_coupons");
        await db.query("DELETE FROM order_products");
        await db.query("DELETE FROM order_promotions");
        await db.query("DELETE FROM orders");
        await db.query("DELETE FROM products");
        await db.query("DELETE FROM users");
        await db.query("DELETE FROM merchants");
    } catch (error) {
        console.error(error);
    }
}

async function afterAllHook() {
    try {
        // await db.query("DROP TABLE IF EXISTS applications");
        // await db.query("DROP TABLE IF EXISTS jobs");
        // await db.query("DROP TABLE IF EXISTS users");
        // await db.query("DROP TABLE IF EXISTS companies");
        await db.end();
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    SOURCE_DATA_USER, 
    SOURCE_DATA_MERCHANT,
    ADDITIONAL_USERS,
    TEST_DATA,
    beforeAllHook,
    beforeEachHook,
    afterEachHook,
    afterAllHook
}