import { GoogleGenerativeAI } from "@google/generative-ai";


/*
|--------------------------------------------------------------------------
| Gemini AI Configuration
|--------------------------------------------------------------------------
|
| This file handles:
| - Gemini initialization
| - AI model setup
| - MCQ generation
| - Resume analysis
| - Performance feedback
|
| Centralizing AI logic here keeps the project scalable and maintainable.
|
*/

const AI_API = process.env.AI_API_KEY;

if (!AI_API) {
    throw new Error("Please provide a API key for AI")
}


/* -------------------------------------------------------------------------- */
/*                            GEMINI INITIALIZATION                           */
/* -------------------------------------------------------------------------- */
const genAI = new GoogleGenerativeAI(AI_API);


/*
|--------------------------------------------------------------------------
| Main AI Model
|--------------------------------------------------------------------------
|
| gemini-2.0-flash:
| - Fast
| - Cheap
| - Great for structured JSON
| - Excellent for production apps
|
*/
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
});


/* -------------------------------------------------------------------------- */
/*                               HELPER FUNCTION                              */
/* -------------------------------------------------------------------------- */

/*
|--------------------------------------------------------------------------
| cleanJsonResponse()
|--------------------------------------------------------------------------
|
| Gemini sometimes returns:
|
| ```json
| { ... }
| ```
|
| This function removes markdown wrappers and safely parses JSON.
|
*/
const cleanJsonResponse = (text) => {
    try {
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleaned)
    } catch (error) {
        console.error("JSON Parse Error", error.message);
        throw new Error("Invalid AI json response")
    }
};


/* -------------------------------------------------------------------------- */
/*                           GENERATE MCQ QUESTIONS                           */
/* -------------------------------------------------------------------------- */

/*
|--------------------------------------------------------------------------
| generateMCQs()
|--------------------------------------------------------------------------
|
| Generates AI-powered MCQs based on:
| - exam
| - subject
| - difficulty
| - question count
|
| Returns clean JSON array.
|
*/

export const generateMCQs = async ({
    exam,
    subject,
    difficulty,
    questionCount,
}) => {
    try {
        const prompt = `
        You are an expert exam question generator.
        Generate ${questionCount} multiple choise questions.
        
        Exam: ${exam}
        Subject: ${subject}
        Difficulty: ${difficulty}
        
        Requirements:
        - Each question must have 4 options
        - Only one correct answer
        - Questions must be realistic
        - Avoid duplicate questions
        - Keep language clear
        - Return only valid JSON
        
        JSON Format:

        [
            {
                "question": "Question text",
                "options": [
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D"
                ],
                "correctAnswer": "Correct option text",
                "explanation": "Short explanation"
            }
        ]
`;
        const result = await model.generateContent(prompt)

        const response = result.response.text()

        return cleanJsonResponse(response);

    } catch (error) {
        console.error("MCQ generation error:", error.message);
        throw new Error("Failed to generate MCQs");
    }
};



/* -------------------------------------------------------------------------- */
/*                             RESUME ANALYZER                                */
/* -------------------------------------------------------------------------- */

/*
|--------------------------------------------------------------------------
| analyzeResume()
|--------------------------------------------------------------------------
|
| Analyzes resume according to:
| - job role
| - exam type
| - skills
|
| Returns:
| - ATS score
| - strengths
| - weaknesses
| - improvements
|
*/
export const analyzeResume = async ({
    resumeText,
    targetRole
}) => {
    try {
        const prompt = `
        You are a professional ATS resume analyzer.
        
        Analyze the following resume for the role:
        
        ${targetRole}
        
        Resume Content:
        ${resumeText}

        Return ONLY valid JSON.

        JSON Format:
        {
            "atsScore": 85,
            "strengths": [
              "Strong backend projects",
              "Good technical skills"
            ],
            "weaknesses": [
              "No internship experience"
            ],
            "missingSkills": [
              "Docker",
              "Redis"
            ],
            "suggestions": [
              "Add measurable achievements",
              "Improve project descriptions"
            ]
        }
        `;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        return cleanJsonResponse(response);
    } catch (error) {
        console.error("Resume Analysis Error:", error.message);

        throw new Error("Failed to analyze resume");
    }
};


/* -------------------------------------------------------------------------- */
/*                         PERFORMANCE FEEDBACK AI                            */
/* -------------------------------------------------------------------------- */

/*
|--------------------------------------------------------------------------
| generatePerformanceFeedback()
|--------------------------------------------------------------------------
|
| Generates personalized feedback based on:
| - score
| - weak topics
| - strong topics
|
*/

export const generatePerformanceFeedback = async ({
  score,
  totalQuestions,
  weakTopics,
  strongTopics,
}) => {
  try {
    const prompt = `
You are an AI learning mentor.

Generate performance feedback.

Score:
${score}/${totalQuestions}

Weak Topics:
${weakTopics.join(", ")}

Strong Topics:
${strongTopics.join(", ")}

Requirements:
- Keep response motivational
- Keep response concise
- Give improvement advice
- Mention strong areas

Return ONLY valid JSON.

JSON Format:

{
  "summary": "Performance summary",
  "improvements": [
    "Practice probability daily"
  ],
  "motivation": "Keep improving consistency"
}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return cleanJsonResponse(response);
  } catch (error) {
    console.error("Performance Feedback Error:", error.message);

    throw new Error("Failed to generate feedback");
  }
};


/* -------------------------------------------------------------------------- */
/*                            GENERIC AI REQUEST                              */
/* -------------------------------------------------------------------------- */

/*
|--------------------------------------------------------------------------
| askAI()
|--------------------------------------------------------------------------
|
| Generic reusable AI function.
|
| Useful for:
| - chatbot
| - future features
| - AI assistant
| - explanations
|
*/
export const askAI = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);

        return result.response.text();
    } catch (error) {
        console.error("Generic AI error:", error.message);

        throw new Error("AI request failed")
    }
}

export default model;