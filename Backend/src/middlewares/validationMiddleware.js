export const validateRegister = (
    req,
    res,
    next
) => {

    const {
        username,
        email,
        password,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Required Fields
    |--------------------------------------------------------------------------
    */

    if (
        !username ||
        !email ||
        !password
    ) {

        res.status(400);

        throw new Error(
            "All fields are required"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Password Validation
    |--------------------------------------------------------------------------
    */

    if (password.length < 6) {

        res.status(400);

        throw new Error(
            "Password must be at least 6 characters"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Email Validation
    |--------------------------------------------------------------------------
    */

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        res.status(400);

        throw new Error(
            "Invalid email format"
        );
    }

    next();
};

/*
|--------------------------------------------------------------------------
| Validate Login
|--------------------------------------------------------------------------
*/

export const validateLogin = (
    req,
    res,
    next
) => {

    const {
        email,
        password,
    } = req.body;

    if (
        !email ||
        !password
    ) {

        res.status(400);

        throw new Error(
            "Email and password are required"
        );
    }

    next();
};