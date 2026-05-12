import asyncHandler from "express-async-handler";
import { generateMCQs } from "../config/ai.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { generateExamTime } from "../utils/generateExamTime.js";


import ExamModel from "../models/examModel.js"
import QuestionModel from "../models/questionModel.js";
import UserAnswerModel from "../models/userAnswerModel.js";
import ExamAttemptModel from "../models/examAttemptModel.js";


/*
|--------------------------------------------------------------------------
| EXAM CREATION CONTROLLER
|--------------------------------------------------------------------------
*/
export const createExam = asyncHandler(async (req, res) => {

    //Get Authenticated User
    const userId = req.user.id;

    const { exam_name, subject, difficulty, total_questions } = req.body;

    if (!exam_name || !subject || !difficulty || !total_questions) {
        res.status(400);
        throw new Error("Please provide all fields")
    };

    //Validate Difficulty
    const allowedDifficulties = ["easy", "medium", "hard"];

    if (!allowedDifficulties.includes(difficulty)) {
        res.status(400);
        throw new Error("Invalid difficulty level")
    };

    //Validate Question Count
    if (total_questions < 5 || total_questions > 50) {
        res.status(400);
        throw new Error("Questions must be between 5 and 50")
    };

    //Generate AI Questions
    const questions = await generateMCQs({
        exam: exam_name,
        subject,
        difficulty,
        questionCount: total_questions,
    });

    if(!questions || !Array.isArray(questions) || questions.length === 0) {
        res.status(500);
        throw new Error("Failed to generate exam questions");
    }

    //Calculate Exam Duration Based On Difficulty
    const duration_minutes = generateExamTime(total_questions, difficulty);

    const exam = await ExamModel.createOne({
        user_id: userId,
        exam_name,
        subject,
        difficulty,
        total_questions,
        duration_minutes,
    });

    //Save Questions
    const formattedQuestions = questions.map((q) => ({
        exam_id: exam.id,
        question_text: q.question,
        options: JSON.stringify(q.options),
        correct_answer: q.correct_answer,
        explanation: q.explanation || "",
    }));

    await QuestionModel.createMany(formattedQuestions);

    //Remove Answers Before Sending To Frontend
    const safeQuestions = questions.map((q, index) => ({
        question_number: index + 1,
        question: q.question,
        options: q.options
    }))

    return sendSuccess(res, 201, "Exam created successfully", {
        examId: exam.id,
        duration_minutes,
        questions: safeQuestions,
    });
});


/*
|--------------------------------------------------------------------------
| EXAM SUBMISSION CONTROLLER
|--------------------------------------------------------------------------
*/
export const submitExam = asyncHandler(async (req, res) => {
    
    const userId = req.user.id;

    const { exam_id, answers } = req.body;

    if(!exam_id || !answers ) {
        res.status(400);
        throw new Error("Exam ID and answers are required")
    };

    //Validate answers array
    if(!Array.isArray(answers) || answers.length === 0) {
        res.status(400);
        throw new Error("Invalid answers format")
    };

    //Fetch Questions From Database
    const questions = await QuestionModel.findByExamId(exam_id);

    if(!questions || questions.length === 0) {
        res.status(404);
        throw new Error("Exam questions not found")
    }

    //Initialize Counters
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    //Store User Answer Results
    const answerResults = [];

    //Compare Answers
    for(const answer of answers) {
        //Find Matching Question
        const question = questions.find(
            (q) => q.id === answer.question_id
        );

        //Skip Invalid Question IDs
        if (!question) {
            continue;
        }

        //Check Correctness
        const isCorrect = answer.selected_answer === question.correct_answer;

        //Update Score
        if(isCorrect) {
            score++;
            correctAnswers++;
        } else {
            wrongAnswers++;
        }

        //Store Answer Result
        answerResults.push({

            question_id: question.id,

            selected_answer: answer.selected_answer,

            correct_answer: question.correct_answer,

            is_correct: isCorrect,

        });
    }

    //Save Exam Attempt
    const attempt = await ExamAttemptModel.createOne({

        user_id: userId,
        exam_id,
        score,
        total_questions: questions.length,
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswers,
    });

    //Format User Answers
    const formattedAnswers = answerResults.map((answer) => ({

        attempt_id: attempt.id,

        question_id: answer.question_id,
        
        selected_answer: answer.selected_answer,

        is_correct: answer.is_correct,
    }));

    //Save User Answers
    await UserAnswerModel.createMany(formattedAnswers)

    return sendSuccess(res, 200, "Exam submitted successfully", {
        result: {
            score,
            total_questions: questions.length,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
        },
        answers: answerResults,
    });
});


/*
|--------------------------------------------------------------------------
| GET EXAM BY ID
|--------------------------------------------------------------------------
*/
export const getExamById = asyncHandler(async (req, res) => {

    const { examId } = req.params;

    if (!examId) {
        res.status(400);

        throw new Error("Exam ID is required");
    }

    const exam = await ExamModel.findById(examId);

    if (!exam) {
        res.status(404);

        throw new Error("Exam not found");
    }

    const questions = await QuestionModel.findByExamId(examId);

    const safeQuestions = questions.map((q, index) => ({

        question_id: q.id,

        question_number: index + 1,

        question: q.question_text,

        options: JSON.parse(q.options),
    }));

    return sendSuccess(res, 200, "Exam fetched successfully", {
        exam: {
            id: exam.id,
            exam_name: exam.exam_name,
            subject: exam.subject,
            difficulty: exam.difficulty,
            total_questions: exam.total_questions,
            duration_minutes: exam.duration_minutes,
        },
        questions: safeQuestions,
    });
});


/*
|--------------------------------------------------------------------------
| GET EXAM HISTORY
|--------------------------------------------------------------------------
*/
export const getExamHistory = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const history = await ExamAttemptModel.findByUserId(userId);

    return sendSuccess(res, 200, "Exam history fetched", {
        total_attempts: history.length,
        history,
    });
});


/*
|--------------------------------------------------------------------------
| GET EXAM RESULT
|--------------------------------------------------------------------------
*/
export const getExamResult = asyncHandler(async (req, res) => {

    const { attemptId } = req.params;

    if (!attemptId) {
        res.status(400);

        throw new Error("Attempt ID is required");
    }

    const attempt = await ExamAttemptModel.findById(attemptId);

    if (!attempt) {
        res.status(404);

        throw new Error("Exam result not found");
    }

    const answers = await UserAnswerModel.findByAttemptId(attemptId);

    return sendSuccess(res, 200, "Exam result fetched", {
        result: attempt,
        answers,
    });
});


/*
|--------------------------------------------------------------------------
| DELETE EXAM
|--------------------------------------------------------------------------
*/
export const deleteExam = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const { examId } = req.params;

    if (!examId) {
        res.status(400);

        throw new Error("Exam ID is required");
    }

    const exam = await ExamModel.findById(examId);

    if (!exam) {
        res.status(404);

        throw new Error("Exam not found");
    }

    if (exam.user_id !== userId) {
        res.status(403);

        throw new Error("Unauthorized access");
    }

    await ExamModel.deleteOne(examId);

    return sendSuccess(res, 200, "Exam deleted successfully");
});


/*
|--------------------------------------------------------------------------
| REGENERATE QUESTIONS
|--------------------------------------------------------------------------
*/
export const regenerateQuestions = asyncHandler(async (req, res) => {

    const { examId } = req.params;

    const exam = await ExamModel.findById(examId);

    if (!exam) {
        res.status(404);

        throw new Error("Exam not found");
    }

    const newQuestions = await generateMCQs({

        exam: exam.exam_name,

        subject: exam.subject,

        difficulty: exam.difficulty,

        questionCount: exam.total_questions,
    });

    await QuestionModel.deleteByExamId(examId);

    const formattedQuestions = newQuestions.map((q) => ({

        exam_id: examId,

        question_text: q.question,

        options: JSON.stringify(q.options),

        correct_answer: q.correctAnswer,

        explanation: q.explanation || "",
    }));

    await QuestionModel.createMany(formattedQuestions);

    const safeQuestions = newQuestions.map((q, index) => ({

        question_number: index + 1,

        question: q.question,

        options: q.options,
    }));

    return sendSuccess(res, 200, "Questions regenerated successfully", {
        questions: safeQuestions,
    });
});


