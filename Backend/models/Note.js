import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  colorIndex: { type: Number, default: 0 },
pinned: { type: Boolean, default: false },
  tags: [String],
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);