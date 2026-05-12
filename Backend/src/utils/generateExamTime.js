/*
|--------------------------------------------------------------------------
| Exam Duration Calculator
|--------------------------------------------------------------------------
|
| Calculates time (in minutes) based on question count and difficulty.
|
| Base formula:
| - Easy:   30 seconds per question
| - Medium: 45 seconds per question
| - Hard:   60 seconds per question
|
| Minimum: 3 minutes
| Maximum: 60 minutes
|
| Examples:
| - 10 easy questions   → 5 minutes
| - 10 medium questions → 8 minutes
| - 10 hard questions   → 10 minutes
| - 20 easy questions   → 10 minutes
| - 20 medium questions → 15 minutes
| - 50 hard questions   → 50 minutes
|
*/


const SECONDS_PER_QUESTION = {
    easy: 30,
    medium: 45,
    hard: 60,
};

const MIN_DURATION = 3;
const MAX_DURATION = 60;


/**
 * Calculate exam duration in minutes
 * 
 * @param {number} totalQuestions - Number of questions
 * @param {string} difficulty - "easy" | "medium" | "hard"
 * @returns {number} Duration in minutes (rounded up)
 */
export const generateExamTime = (totalQuestions, difficulty) => {

    const secondsPerQ = SECONDS_PER_QUESTION[difficulty] || SECONDS_PER_QUESTION.medium;

    const totalSeconds = totalQuestions * secondsPerQ;

    const minutes = Math.ceil(totalSeconds / 60);

    // Clamp between min and max
    return Math.max(MIN_DURATION, Math.min(MAX_DURATION, minutes));
};
