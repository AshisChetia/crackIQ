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


/*
|--------------------------------------------------------------------------
| Validate Create Exam
|--------------------------------------------------------------------------
*/

export const validateCreateExam = (
    req,
    res,
    next
) => {

    const {
        exam_name,
        subject,
        difficulty,
        total_questions,
    } = req.body;

    if (
        !exam_name ||
        !subject ||
        !difficulty ||
        !total_questions
    ) {
        res.status(400);

        throw new Error(
            "All exam fields are required"
        );
    }

    const allowedDifficulties = [
        "easy",
        "medium",
        "hard",
    ];

    if (
        !allowedDifficulties.includes(difficulty)
    ) {
        res.status(400);

        throw new Error(
            "Invalid difficulty level"
        );
    }

    if (
        total_questions < 5 ||
        total_questions > 50
    ) {
        res.status(400);

        throw new Error(
            "Questions must be between 5 and 50"
        );
    }

    next();
};


/*
|--------------------------------------------------------------------------
| Validate Submit Exam
|--------------------------------------------------------------------------
*/

export const validateSubmitExam = (
    req,
    res,
    next
) => {

    const {
        exam_id,
        answers,
    } = req.body;

    if (!exam_id || !answers) {

        res.status(400);

        throw new Error(
            "Exam ID and answers are required"
        );
    }

    if (!Array.isArray(answers)) {

        res.status(400);

        throw new Error(
            "Invalid answers format"
        );
    }

    next();
};