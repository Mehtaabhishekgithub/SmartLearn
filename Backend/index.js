import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import studyPlanRoutes from './routes/studyPlanRoutes.js'; 
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import notesRoutes from './routes/notesRoutes.js';



dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://smart-learn-tan.vercel.app', // ← yeh add karo
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/study-plan', studyPlanRoutes); 
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', notesRoutes);


app.listen(5000, () => console.log('Server running on port 5000'));