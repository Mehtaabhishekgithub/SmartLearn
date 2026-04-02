import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  userAnswer: { type: String, default: null },
  isCorrect: { type: Boolean, default: false },
});

const quizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  questions: [questionSchema],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

quizSchema.plugin(mongoosePaginate);

export default mongoose.model('Quiz', quizSchema);