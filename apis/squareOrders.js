const BASE_URL = 'https://connect.squareup.com/v2/orders';
const {SQUARE_APP_ID, SQUARE_TOKEN, SQUARE_VERSION} = require("../config");
const axios = require("axios");


// TODO
// https://developer.squareup.com/docs/payment-form/payment-form-walkthrough


const instance = axios.create({
    baseURL: BASE_URL
})

instance.defaults.headers.common['Authorization'] = `Bearer ${SQUARE_TOKEN}`;
instance.defaults.headers.common['Square-Version'] = SQUARE_VERSION;
instance.defaults.headers.post['Content-Type'] = 'application/json';

export async function createNewOrder() {

    instance.post()

    try {
        const res = await instance.post()
        return res
    } catch (error) {
        return {
            error: true,
            res: error
        }
    }
}
