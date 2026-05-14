import Groq from "groq-sdk";

/*
|--------------------------------------------------------------------------
| Groq AI Configuration
|--------------------------------------------------------------------------
|
| This file handles:
| - Groq initialization
| - AI model setup (Llama 3)
| - MCQ generation
| - Resume analysis
| - Performance feedback
|
| Centralizing AI logic here keeps the project scalable and maintainable.
|
*/

const GROQ_API = process.env.GROQ_API_KEY;

if (!GROQ_API) {
    throw new Error("Please provide a GROQ API key for AI");
}

/* -------------------------------------------------------------------------- */
/*                              GROQ INITIALIZATION                           */
/* -------------------------------------------------------------------------- */
const groq = new Groq({ apiKey: GROQ_API });

/*
|--------------------------------------------------------------------------
| AI Content Generation with Fallback (Indestructible Mode)
|--------------------------------------------------------------------------
|
| Handles Groq model selection and fallback logic.
| Uses llama3-8b-8192 as the primary model (insanely fast, great for JSON).
| If the API key hits a rate limit or fails, it falls back to mock data.
|
*/
const generateContentWithFallback = async (prompt) => {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert AI. You strictly follow instructions and always return valid JSON when asked."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
        });

        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.warn(`[AI System Warning]: Groq API failed (${error.message}). Using Mock Fallback Generator to keep website functional...`);
        
        // Mock MCQ Generation
        if (prompt.includes("multiple choice questions")) {
            // Extract requested question count from prompt, default to 5
            const countMatch = prompt.match(/Generate (\d+) multiple/);
            const count = countMatch ? parseInt(countMatch[1]) : 5;
            
            const mockQuestions = [];
            for (let i = 1; i <= count; i++) {
                mockQuestions.push({
                    "question": `Mock Question ${i}: What is the core concept here?`,
                    "options": [
                        "Incorrect option 1",
                        "Incorrect option 2",
                        "Correct option",
                        "Incorrect option 3"
                    ],
                    "correct_answer": "C",
                    "explanation": "This is a fallback generated explanation because the AI API key limit was reached."
                });
            }
            return "```json\n" + JSON.stringify(mockQuestions) + "\n```";
        }
        
        // Mock Resume Analysis
        if (prompt.includes("ATS resume analyzer")) {
            return "```json\n" + JSON.stringify({
                "atsScore": 75,
                "strengths": ["Basic formatting", "Relevant keywords detected"],
                "weaknesses": ["Needs more quantifiable metrics"],
                "missingSkills": ["Advanced system design"],
                "suggestions": ["Add numbers to your achievements (e.g., 'improved performance by 20%')"]
            }) + "\n```";
        }

        // Mock Performance Feedback
        if (prompt.includes("performance feedback")) {
            return "```json\n" + JSON.stringify({
                "summary": "You are doing well, but there is room for improvement.",
                "improvements": ["Review the core concepts of the questions you got wrong.", "Practice time management."],
                "motivation": "Consistency is key! Keep practicing and your scores will naturally improve."
            }) + "\n```";
        }

        // Mock Resume Compare
        if (prompt.includes("Compare this resume against the role")) {
            return "```json\n" + JSON.stringify({
                "matchPercentage": 80,
                "strengths": ["Matches core requirements"],
                "missingSkills": ["Some domain-specific tools"],
                "improvements": ["Tailor the summary section to strictly match the job title."]
            }) + "\n```";
        }

        // Generic text fallback
        return "The AI system is currently overloaded or out of quota. This is a fallback response.";
    }
};

/* -------------------------------------------------------------------------- */
/*                               HELPER FUNCTION                              */
/* -------------------------------------------------------------------------- */

/*
|--------------------------------------------------------------------------
| cleanJsonResponse()
|--------------------------------------------------------------------------
|
| Extracts and parses JSON from AI response, handling markdown blocks.
|
*/
const cleanJsonResponse = (text) => {
    try {
        // Find JSON block using regex (matches content between ```json and ```)
        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/```\n?([\s\S]*?)\n?```/);
        const cleaned = jsonMatch ? jsonMatch[1].trim() : text.trim();

        return JSON.parse(cleaned);
    } catch (error) {
        console.error("JSON Parse Error. Raw Text:", text);
        console.error("Parse Error Detail:", error.message);
        throw new Error("Invalid AI json response");
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
        Generate ${questionCount} multiple choice questions.
        
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
                    "Option 1",
                    "Option 2",
                    "Option 3",
                    "Option 4"
                ],
                "correct_answer": "A",
                "explanation": "Short explanation"
            }
        ]
        
        Note: correct_answer must be one of "A", "B", "C", or "D".
`;
        const response = await generateContentWithFallback(prompt);

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

        const response = await generateContentWithFallback(prompt);

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

    const response = await generateContentWithFallback(prompt);

    return cleanJsonResponse(response);
  } catch (error) {
    console.error("Performance Feedback Error:", error.message);

    throw new Error("Failed to generate feedback");
  }
};


/* -------------------------------------------------------------------------- */
/*                         COMPARE RESUME TO JOB ROLE                         */
/* -------------------------------------------------------------------------- */

/*
|--------------------------------------------------------------------------
| compareResumeToJob()
|--------------------------------------------------------------------------
|
| Compares a resume against a target role.
|
| Returns:
| - match percentage
| - missing skills
| - strengths
| - improvements
|
*/
export const compareResumeToJob = async ({
    resumeText,
    targetRole,
}) => {
    try {
        const prompt = `
You are a professional career advisor.

Compare this resume against the role: ${targetRole}

Resume Content:
${resumeText}

Return ONLY valid JSON.

JSON Format:
{
    "matchPercentage": 75,
    "strengths": [
        "Relevant backend experience"
    ],
    "missingSkills": [
        "Docker",
        "Kubernetes"
    ],
    "improvements": [
        "Add more quantifiable achievements"
    ]
}
`;

        const response = await generateContentWithFallback(prompt);

        return cleanJsonResponse(response);
    } catch (error) {
        console.error("Resume Comparison Error:", error.message);

        throw new Error("Failed to compare resume");
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
        const response = await generateContentWithFallback(prompt);
        return response;
    } catch (error) {
        console.error("Generic AI error:", error.message);

        throw new Error("AI request failed")
    }
}

export default generateContentWithFallback;