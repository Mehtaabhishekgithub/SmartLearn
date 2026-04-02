import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: { type: String, required: true },
  topics: [
    {
      day: Number,
      title: String,
      description: String,
      completed: { type: Boolean, default: false },
    },
  ],
}, { timestamps: true });

export default mongoose.model('StudyPlan', studyPlanSchema);