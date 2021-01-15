const {
    ensureLoggedIn,
    ensureCorrectUser,
    ensureIsUser,
    ensureCorrectMerchant,
    ensureIsMerchant
} = require("../../middleware/auth");


// Login Check
describe("Check function ensureLoggedIn", () => {
    const validUser = {
        id: 1,
        type: "user",
        first_name: "userFirstName1",
        last_name: "userLastName1"
    };

    const validMerchant = {
        id: 1,
        type: "merchant",
        display_name: "merchantDisplayName1"
    };

    const mockNext = (status = {status: 200, message: "Passed"}) => {
        return (status);
    };

    // Test 1 - Returns 'ok' status when a valid user is provided
    test("Returns 'ok' status when a valid user/merchant is provided", async () => {
        const res = ensureLoggedIn({user: validUser}, {}, mockNext);

        expect(res.status).toBe(200);
        expect(res.message).toBe("Passed");
    });
    
    // Test 2 - Returns 'Unauthorized' status when there is no valid user
    test("Returns 'Unauthorized' status when there is no valid user", async () => {
        const res = ensureLoggedIn({}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });
});

// Check Correct User
describe("Check function ensureCorrectUser", () => {
    const validUser = {
        id: 1,
        type: "user",
        first_name: "userFirstName1",
        last_name: "userLastName1"
    };

    const validMerchant = {
        id: 1,
        type: "merchant",
        display_name: "merchantDisplayName1"
    };

    const mockNext = (status = {status: 200, message: "Passed"}) => {
        return (status);
    };

    // Test 1 - Returns 'ok' status when a valid user is provided
    test("Returns 'ok' status when a valid user is provided", async () => {
        const res = ensureCorrectUser({user: validUser, params: {id: validUser.id}}, {}, mockNext);

        expect(res.status).toBe(200);
        expect(res.message).toBe("Passed");
    });
    
    // Test 2 - Returns 'Unauthorized' status when there is no valid user
    test("Returns 'Unauthorized' status when there is no valid user", async () => {
        const res = ensureCorrectUser({}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });

    // Test 3 - Returns 'Unauthorized' status on a user mismatch
    test("Returns 'Unauthorized' status on a user mismatch", async () => {
        const res = ensureCorrectUser({user: validUser, params: {id: 2}}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });

    // Test 4 - Returns 'Unauthorized' status on a merchant trying to access a user route
    test("Returns 'Unauthorized' status on a merchant trying to access a user route", async () => {
        const res = ensureCorrectUser({user: validMerchant, params: {id: validMerchant.id}}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });
});

// Check Is a User
describe("Check function ensureIsUser", () => {
    const validUser = {
        id: 1,
        type: "user",
        first_name: "userFirstName1",
        last_name: "userLastName1"
    };

    const validMerchant = {
        id: 1,
        type: "merchant",
        display_name: "merchantDisplayName1"
    };

    const mockNext = (status = {status: 200, message: "Passed"}) => {
        return (status);
    };

    // Test 1 - Returns 'ok' status when a valid user is provided
    test("Returns 'ok' status when is of type user", async () => {
        const res = ensureIsUser({user: validUser}, {}, mockNext);

        expect(res.status).toBe(200);
        expect(res.message).toBe("Passed");
    });
    
    // Test 2 - Returns 'Unauthorized' status when there is no valid user
    test("Returns 'Unauthorized' status when there is no valid user", async () => {
        const res = ensureIsUser({}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });

    // Test 3 - Returns 'Unauthorized' status when is not of type user
    test("Returns 'Unauthorized' status when is not of type user", async () => {
        const res = ensureIsUser({user: validMerchant}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });
});



// Check Correct User
describe("Check function ensureCorrectMerchant", () => {
    const validUser = {
        id: 1,
        type: "user",
        first_name: "userFirstName1",
        last_name: "userLastName1"
    };

    const validMerchant = {
        id: 1,
        type: "merchant",
        display_name: "merchantDisplayName1"
    };

    const mockNext = (status = {status: 200, message: "Passed"}) => {
        return (status);
    };

    // Test 1 - Returns 'ok' status when a valid user is provided
    test("Returns 'ok' status when a valid merchant is provided", async () => {
        const res = ensureCorrectMerchant({user: validMerchant, params: {id: validMerchant.id}}, {}, mockNext);

        expect(res.status).toBe(200);
        expect(res.message).toBe("Passed");
    });
    
    // Test 2 - Returns 'Unauthorized' status when there is no valid merchant
    test("Returns 'Unauthorized' status when there is no valid merchant", async () => {
        const res = ensureCorrectMerchant({}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });

    // Test 3 - Returns 'Unauthorized' status on a merchant mismatch
    test("Returns 'Unauthorized' status on a merchant mismatch", async () => {
        const res = ensureCorrectMerchant({user: validMerchant, params: {id: 2}}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });

    // Test 4 - Returns 'Unauthorized' status on a user trying to access a merchant route
    test("Returns 'Unauthorized' status on a user trying to access a merchant route", async () => {
        const res = ensureCorrectMerchant({user: validUser, params: {id: validUser.id}}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });
});

// Check Is a User
describe("Check function ensureIsMerchant", () => {
    const validUser = {
        id: 1,
        type: "user",
        first_name: "userFirstName1",
        last_name: "userLastName1"
    };

    const validMerchant = {
        id: 1,
        type: "merchant",
        display_name: "merchantDisplayName1"
    };

    const mockNext = (status = {status: 200, message: "Passed"}) => {
        return (status);
    };

    // Test 1 - Returns 'ok' status when a valid merchant is provided
    test("Returns 'ok' status when is of type merchant", async () => {
        const res = ensureIsMerchant({user: validMerchant}, {}, mockNext);

        expect(res.status).toBe(200);
        expect(res.message).toBe("Passed");
    });
    
    // Test 2 - Returns 'Unauthorized' status when there is no valid merchant
    test("Returns 'Unauthorized' status when there is no valid merchant", async () => {
        const res = ensureIsMerchant({}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });

    // Test 3 - Returns 'Unauthorized' status when is not of type merchant
    test("Returns 'Unauthorized' status when is not of type merchant", async () => {
        const res = ensureIsMerchant({user: validUser}, {}, mockNext);

        expect(res.status).toBe(401);
        expect(res.message).toBe("Unauthorized");
    });
});