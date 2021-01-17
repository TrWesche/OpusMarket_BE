// See user/merchant routes.
const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../config");


class AuthHandling {
    static generateCookies(queryRes, queryData) {
        const token = jwt.sign(queryData, PRIVATE_KEY, { algorithm: 'RS256'});
        const split_token = token.split(".");

        // Javascript Enabled Cookie - Full JWT
        // queryRes.cookie("sid", token, {httpOnly: false, maxAge: 86400000, secure: true, sameSite: "None", path: '/'});
        queryRes.cookie("sid", token, {httpOnly: false, maxAge: 86400000, path: '/'});

        // HTTP Only Cookie - JWT Signature Only
        // queryRes.cookie("_sid", split_token[2], {httpOnly: true, maxAge: 86400000, secure: true, sameSite: "None", path: '/'});
        queryRes.cookie("_sid", split_token[2], {httpOnly: true, maxAge: 86400000, path: '/'});
    }

    static validateCookies(queryReq) {
        const privateToken = queryReq.cookies._sid;
        const split_publicToken = queryReq.cookies.sid.split(".");

        // Reconstruct Check Token
        const verificationToken = `${split_publicToken[0]}.${split_publicToken[1]}.${privateToken}`;

        let verifyResult;
        try {
            verifyResult = jwt.verify(verificationToken, PRIVATE_KEY, {algorithms: ['RS256']}); 
        } catch (error) {
            console.log("Verification Error Occured:", error)
        }

        return verifyResult;
    }
}

module.exports = AuthHandling;