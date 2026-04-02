import Groq from 'groq-sdk';
import Quiz from '../models/Quiz.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Generate Quiz
export const generateQuiz = async (req, res) => {
  const { subject, topic, numQuestions = 5 } = req.body;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `Generate ${numQuestions} MCQ questions about "${topic}" in "${subject}".
        Return ONLY a JSON array, no extra text:
        [
          {
            "question": "Question here?",
            "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
            "correctAnswer": "A) option1"
          }
        ]`,
      },
    ],
  });

  const text = response.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, '').trim();
  const questions = JSON.parse(cleaned);

  const quiz = await Quiz.create({
    user: req.user._id,
    subject,
    topic,
    questions,
    totalQuestions: questions.length,
  });

  res.status(201).json({ success: true, quiz });
};

// Submit Quiz
export const submitQuiz = async (req, res) => {
  const { answers } = req.body;
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  if (quiz.completed) return res.status(400).json({ message: 'Quiz already submitted' });

  let score = 0;

  quiz.questions = quiz.questions.map((q, i) => {
    const userAnswer = answers[i] || null;
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) score++;
    return { ...q.toObject(), userAnswer, isCorrect };
  });

  quiz.score = score;
  quiz.percentage = Math.round((score / quiz.totalQuestions) * 100);
  quiz.completed = true;
  await quiz.save();

  res.json({ success: true, quiz });
};

// Get all quizzes of user
export const getMyQuizzes = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await Quiz.paginate(
    { user: req.user._id },
    { page, limit, sort: { createdAt: -1 } }
  );

  res.json({ success: true, quizzes: result.docs, totalPages: result.totalPages });
};

// Get single quiz
export const getQuizById = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.json({ success: true, quiz });
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Quiz deleted' });
};