import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true, select: false },
  streak:    { type: Number, default: 0 },
  lastLogin: { type: Date },
  xp:        { type: Number, default: 0 },
}, { timestamps: true });

userSchema.pre('save', async function () {  // ← next parameter hatao
  if (!this.isModified('password')) return;  // ← return next() ki jagah sirf return
  this.password = await bcrypt.hash(this.password, 10);
  // ← end mein next() call nahi karna
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);