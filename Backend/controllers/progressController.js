import Quiz from '../models/Quiz.js';
import StudyPlan from '../models/StudyPlan.js';

export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const allQuizzes = await Quiz.find({ user: userId });
    const completedQuizzes = allQuizzes.filter(q => q.completed);

    const totalQuizzes = allQuizzes.length;
    const avgScore = completedQuizzes.length
      ? Math.round(completedQuizzes.reduce((sum, q) => sum + q.percentage, 0) / completedQuizzes.length)
      : 0;
    const bestScore = completedQuizzes.length
      ? Math.max(...completedQuizzes.map(q => q.percentage))
      : 0;

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const count = completedQuizzes.filter(q => {
        const d = new Date(q.updatedAt);
        return d >= dayStart && d <= dayEnd;
      }).length;

      last7Days.push({
        day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        quizzes: count,
      });
    }

    const studyPlans = await StudyPlan.find({ user: userId });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const nextDate = new Date(checkDate);
      nextDate.setDate(checkDate.getDate() + 1);

      const hasActivity = completedQuizzes.some(q => {
        const d = new Date(q.updatedAt);
        return d >= checkDate && d < nextDate;
      });

      if (hasActivity) streak++;
      else if (i > 0) break;
    }

    res.json({
      quizStats: { totalQuizzes, completedQuizzes: completedQuizzes.length, avgScore, bestScore },
      studyStats: { totalPlans: studyPlans.length },
      streak,
      last7Days,
      recentQuizzes: completedQuizzes.slice(-5).reverse().map(q => ({
        subject: q.subject,
        topic: q.topic,
        percentage: q.percentage,
        date: q.updatedAt,
      })),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};