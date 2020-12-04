// TODO: If makes sense encapsulate cookie expiration functionality in this function.
// See user/merchant routes.
const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config");


class AuthHandling {

    static generateCookies(queryRes, queryData) {
        const token = jwt.sign(queryData, PRIVATE_KEY);
        const split_token = token.split(".");

        // HTTP Only Cookie - JWT Signature Only
        queryRes.cookie("_sid", split_token[2], {httpOnly: true, signed: true, maxAge: 86400000});

        // Javascript Enabled Cookie - Full JWT
        queryRes.cookie("sid", token, {signed: true, maxAge: 86400000});
    }

    static validateCookies(queryReq) {
        const privateToken = queryReq.signedCookies._sid;
        const split_publicToken = queryReq.signedCookies.sid.split(".");

        // Reconstruct Check Token
        const verificationToken = `${split_publicToken[0]}.${split_publicToken[1]}.${privateToken}`;

        const verifyResult = jwt.verify(verificationToken, PRIVATE_KEY);
        return verifyResult;
    }
}

module.exports = AuthHandling;