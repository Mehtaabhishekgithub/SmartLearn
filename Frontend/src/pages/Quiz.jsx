import { useState, useEffect } from 'react';
import { generateQuiz, submitQuiz, getMyQuizzes, deleteQuiz } from '../services/quizService.js';
import toast from 'react-hot-toast';

const Quiz = () => {
  const [step, setStep] = useState('form');
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: '', topic: '', numQuestions: 5 });

  useEffect(() => { fetchQuizzes(); }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await getMyQuizzes();
      setQuizzes(res.data.quizzes);
    } catch {
      toast.error('Failed to load quizzes');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await generateQuiz(form);
      setCurrentQuiz(res.data.quiz);
      setAnswers(new Array(res.data.quiz.questions.length).fill(null));
      setCurrentQ(0);
      setStep('playing');
      toast.success('Quiz generated!');
    } catch {
      toast.error('Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswer = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      toast.error('Please answer all questions!');
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitQuiz(currentQuiz._id, answers);
      setResult(res.data.quiz);
      setQuizzes([res.data.quiz, ...quizzes.filter(q => q._id !== res.data.quiz._id)]);
      setStep('result');
    } catch {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setStep('form');
    setCurrentQuiz(null);
    setAnswers([]);
    setCurrentQ(0);
    setResult(null);
    setForm({ subject: '', topic: '', numQuestions: 5 });
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q._id !== id));
      toast.success('Deleted!');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getScoreColor = (pct) => {
    if (pct >= 80) return '#16a34a';
    if (pct >= 60) return '#9333ea';
    return '#dc2626';
  };

  const getHistoryCardStyle = (i) => {
    const styles = [
      { bg: '#eff6ff', border: '#bfdbfe' },
      { bg: '#fdf4ff', border: '#e9d5ff' },
      { bg: '#f0fdf4', border: '#bbf7d0' },
      { bg: '#fff7ed', border: '#fed7aa' },
    ];
    return styles[i % styles.length];
  };

  // ── Form Screen ──
  if (step === 'form') return (
    <div className="min-h-screen page-enter" style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #fdf4ff 50%, #eff6ff 100%)' }}>

      {/* Navbar */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderBottom: '1px solid #e9d5ff', backdropFilter: 'blur(10px)' }}
        className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#7c3aed' }}>AI Quiz</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Test your knowledge with AI-generated questions</p>
          </div>
          
           < a href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition hover:bg-purple-50"
            style={{ border: '1.5px solid #7c3aed', color: '#7c3aed', backgroundColor: 'transparent' }}
          >
            <span>⊞</span>
            <span>Dashboard</span>
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Generate Form Card */}
          <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: '#fff', border: '1.5px solid #e9d5ff', boxShadow: '0 4px 24px rgba(124,58,237,0.08)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                ✨
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1f2937' }}>Generate New Quiz</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#7c3aed' }}>Subject</label>
                <input
                  type="text"
                  placeholder="e.g. JavaScript"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                  style={{ border: '1.5px solid #e5e7eb', backgroundColor: '#fff', color: '#1f2937' }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#7c3aed' }}>Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Arrays, Functions, Promises"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                  style={{ border: '1.5px solid #e5e7eb', backgroundColor: '#fff', color: '#1f2937' }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#7c3aed' }}>Number of Questions</label>
                <select
                  value={form.numQuestions}
                  onChange={(e) => setForm({ ...form, numQuestions: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                  style={{ border: '1.5px solid #e5e7eb', backgroundColor: '#fff', color: '#1f2937' }}
                >
                  {[3, 5, 10].map(n => <option key={n} value={n}>{n} Questions</option>)}
                </select>
              </div>
              <button
                type="submit"
                disabled={generating}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition disabled:opacity-60 active:scale-95 flex items-center justify-center gap-2"
                style={{ background: generating ? '#a855f7' : 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>⚡ Generate Quiz</>
                )}
              </button>
            </form>
          </div>

          {/* Quiz History */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                🕐
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1f2937' }}>Quiz History</h2>
            </div>

            {quizzes.length === 0 ? (
              <div className="text-center py-16 rounded-3xl" style={{ backgroundColor: '#fff', border: '1.5px solid #e9d5ff' }}>
                <p className="text-4xl mb-3">📋</p>
                <p className="text-sm" style={{ color: '#9ca3af' }}>No quizzes yet. Generate one!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {quizzes.map((quiz, i) => {
                  const style = getHistoryCardStyle(i);
                  return (
                    <div
                      key={quiz._id}
                      className="rounded-2xl px-5 py-4 flex items-center justify-between group transition hover:shadow-md"
                      style={{ backgroundColor: style.bg, border: `1.5px solid ${style.border}` }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-bold" style={{ color: '#1f2937' }}>{quiz.subject}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: style.border, color: '#4b5563' }}>
                            {quiz.topic}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: '#6b7280' }}>
                          <span>⚡ {quiz.totalQuestions} Questions</span>
                          <span>{new Date(quiz.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {quiz.completed && (
                          <div className="text-right">
                            <p className="text-2xl font-extrabold" style={{ color: getScoreColor(quiz.percentage) }}>
                              {quiz.percentage}%
                            </p>
                            <p className="text-xs" style={{ color: '#9ca3af' }}>Score</p>
                          </div>
                        )}
                        <button
                          onClick={() => handleDelete(quiz._id)}
                          className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Playing Screen ──
  if (step === 'playing') {
    const q = currentQuiz.questions[currentQ];
    const progress = ((currentQ + 1) / currentQuiz.questions.length) * 100;
    const answered = answers.filter(a => a !== null).length;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 page-enter"
        style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #fdf4ff 50%, #eff6ff 100%)' }}>
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#7c3aed' }}>
                {currentQuiz.subject} — {currentQuiz.topic}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                Question {currentQ + 1} of {currentQuiz.questions.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: '#7c3aed' }}>{answered}/{currentQuiz.questions.length} answered</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full mb-8 overflow-hidden" style={{ backgroundColor: '#e9d5ff' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
            />
          </div>

          {/* Question Card */}
          <div className="rounded-3xl p-6 sm:p-8 mb-6"
            style={{ backgroundColor: '#fff', border: '1.5px solid #e9d5ff', boxShadow: '0 4px 24px rgba(124,58,237,0.08)' }}>
            <h2 className="text-lg sm:text-xl font-bold mb-6" style={{ color: '#1f2937' }}>
              {currentQ + 1}. {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-200 active:scale-[0.99]"
                  style={{
                    border: answers[currentQ] === option ? '2px solid #7c3aed' : '1.5px solid #e5e7eb',
                    backgroundColor: answers[currentQ] === option ? '#f5f3ff' : '#fff',
                    color: answers[currentQ] === option ? '#7c3aed' : '#374151',
                    boxShadow: answers[currentQ] === option ? '0 0 0 3px rgba(124,58,237,0.1)' : 'none',
                  }}
                >
                  <span className="font-bold mr-3" style={{ color: answers[currentQ] === option ? '#7c3aed' : '#9ca3af' }}>
                    {['A', 'B', 'C', 'D'][i]}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQ(q => q - 1)}
              disabled={currentQ === 0}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-40"
              style={{ border: '1.5px solid #e9d5ff', color: '#7c3aed', backgroundColor: '#fff' }}
            >
              ← Prev
            </button>

            {currentQ === currentQuiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 rounded-xl text-sm font-bold transition disabled:opacity-60 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: '#fff' }}
              >
                {submitting ? 'Submitting...' : '✅ Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQ(q => q + 1)}
                className="px-8 py-3 rounded-xl text-sm font-bold transition active:scale-95"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Result Screen ──
  if (step === 'result') return (
    <div className="min-h-screen flex items-center justify-center p-4 page-enter"
      style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #fdf4ff 50%, #eff6ff 100%)' }}>
      <div className="w-full max-w-2xl">

        <div className="rounded-3xl p-6 sm:p-8"
          style={{ backgroundColor: '#fff', border: '1.5px solid #e9d5ff', boxShadow: '0 4px 24px rgba(124,58,237,0.08)' }}>

          {/* Score */}
          <div className="text-center mb-8">
            <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: result.percentage >= 70 ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)', border: `3px solid ${result.percentage >= 70 ? '#16a34a' : '#dc2626'}` }}>
              <span className="text-3xl font-extrabold" style={{ color: result.percentage >= 70 ? '#16a34a' : '#dc2626' }}>
                {result.percentage}%
              </span>
            </div>
            <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1f2937' }}>
              {result.percentage >= 80 ? '🎉 Excellent!' : result.percentage >= 60 ? '👍 Good job!' : '😅 Keep practicing!'}
            </h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              You got {result.score} out of {result.totalQuestions} correct
            </p>
          </div>

          {/* Review */}
          <div className="space-y-3 mb-8 max-h-72 overflow-y-auto pr-1">
            {result.questions.map((q, i) => (
              <div key={i} className="p-4 rounded-2xl"
                style={{ backgroundColor: q.isCorrect ? '#f0fdf4' : '#fff1f2', border: `1px solid ${q.isCorrect ? '#bbf7d0' : '#fecdd3'}` }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#1f2937' }}>
                  {i + 1}. {q.question}
                </p>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  Your answer: <span className="font-semibold" style={{ color: q.isCorrect ? '#16a34a' : '#dc2626' }}>{q.userAnswer}</span>
                </p>
                {!q.isCorrect && (
                  <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                    Correct: <span className="font-semibold" style={{ color: '#16a34a' }}>{q.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetQuiz}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}
            >
              Try Another Quiz
            </button>
            
             < a href="/dashboard"
              className="flex-1 py-3 rounded-xl text-sm font-bold text-center transition"
              style={{ border: '1.5px solid #e9d5ff', color: '#7c3aed', backgroundColor: '#fff' }}
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;