import { useState, useEffect } from 'react';
import { getProgress } from '../services/progressService.js';
import toast from 'react-hot-toast';
import Loader from '../components/Loader.jsx';

const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.quizzes), 1);
  return (
    <div className="flex items-end justify-between gap-2 mt-4" style={{ height: '160px' }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-xs" style={{ color: '#9ca3af' }}>{d.quizzes > 0 ? d.quizzes : ''}</span>
          <div
            className="w-full rounded-t-xl transition-all duration-700"
            style={{
              height: `${(d.quizzes / max) * 120}px`,
              minHeight: d.quizzes > 0 ? '8px' : '2px',
              background: d.quizzes > 0
                ? 'linear-gradient(180deg, #60a5fa, #3b82f6)'
                : '#f1f5f9',
            }}
          />
          <span className="text-xs" style={{ color: '#9ca3af' }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.quizzes), 1);
  const points = data.map((d, i) => ({
    x: 40 + (i * (320 / (data.length - 1))),
    y: 130 - ((d.quizzes / max) * 100),
    val: d.quizzes,
    day: d.day,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width="100%" viewBox="0 0 400 160" className="mt-4">
      {/* Y axis lines */}
      {[0, 25, 50, 75, 100].map((pct, i) => (
        <g key={i}>
          <line x1="40" y1={130 - pct} x2="380" y2={130 - pct} stroke="#f1f5f9" strokeWidth="1" />
          <text x="32" y={134 - pct} fontSize="8" fill="#9ca3af" textAnchor="end">{Math.round((pct / 100) * max)}</text>
        </g>
      ))}
      {/* Line */}
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
          <circle cx={p.x} cy={p.y} r="2" fill="#fff" />
          <text x={p.x} y="150" fontSize="8" fill="#9ca3af" textAnchor="middle">{p.day}</text>
        </g>
      ))}
    </svg>
  );
};

const Progress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProgress();
        setData(res.data);
      } catch {
        toast.error('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading your progress..." />;

  const { quizStats, studyStats, streak, last7Days, recentQuizzes } = data;

  const statCards = [
    {
      label: 'TOTAL QUIZZES',
      value: quizStats.totalQuizzes,
      icon: '📖',
      iconBg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      valueColor: '#1f2937',
    },
    {
      label: 'AVG SCORE',
      value: `${quizStats.avgScore}%`,
      icon: '📈',
      iconBg: 'linear-gradient(135deg, #10b981, #06b6d4)',
      valueColor: '#10b981',
    },
    {
      label: 'BEST SCORE',
      value: `${quizStats.bestScore}%`,
      icon: '🏆',
      iconBg: 'linear-gradient(135deg, #f59e0b, #f97316)',
      valueColor: '#f59e0b',
    },
    {
      label: 'DAY STREAK',
      value: streak,
      icon: '🔥',
      iconBg: 'linear-gradient(135deg, #ef4444, #f97316)',
      valueColor: '#f97316',
    },
  ];

  const overviewCards = [
    {
      label: 'Study Plans Created',
      sub: 'Total plans',
      value: studyStats.totalPlans,
      bg: '#f5f3ff',
      border: '#ddd6fe',
      valueColor: '#7c3aed',
    },
    {
      label: 'Quizzes Completed',
      sub: `Out of ${quizStats.totalQuizzes} total`,
      value: quizStats.completedQuizzes,
      bg: '#f0fdf4',
      border: '#bbf7d0',
      valueColor: '#16a34a',
    },
    {
      label: 'Current Streak',
      sub: 'Consecutive days',
      value: `${streak} 🔥`,
      bg: '#fff7ed',
      border: '#fed7aa',
      valueColor: '#ea580c',
    },
  ];

  return (
    <div
      className="min-h-screen page-enter"
      style={{ backgroundColor: '#f8fafc' }}
    >
      {/* Navbar */}
      <div
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderBottom: '1px solid #e9d5ff',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              📊
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#1f2937' }}>My Progress</h1>
              <p className="text-xs" style={{ color: '#6b7280' }}>Track your learning journey</p>
            </div>
          </div>
          
           <a href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium transition hover:opacity-70"
            style={{ color: '#3b82f6' }}
          >
            ← Dashboard
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 sm:p-5"
              style={{
                backgroundColor: '#fff',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold tracking-wider" style={{ color: '#9ca3af' }}>
                  {stat.label}
                </p>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ background: stat.iconBg }}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: stat.valueColor }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

          {/* Bar Chart */}
          <div
            className="rounded-2xl p-5 sm:p-6"
            style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h2 className="text-base font-bold" style={{ color: '#1f2937' }}>Quizzes This Week</h2>
            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Daily quiz activity</p>
            {last7Days.every(d => d.quizzes === 0) ? (
              <div className="h-40 flex items-center justify-center">
                <p className="text-sm" style={{ color: '#9ca3af' }}>No activity this week. Take a quiz!</p>
              </div>
            ) : (
              <BarChart data={last7Days} />
            )}
          </div>

          {/* Line Chart */}
          <div
            className="rounded-2xl p-5 sm:p-6"
            style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h2 className="text-base font-bold" style={{ color: '#1f2937' }}>Progress Over Time</h2>
            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Your average scores by week</p>
            {last7Days.every(d => d.quizzes === 0) ? (
              <div className="h-40 flex items-center justify-center">
                <p className="text-sm" style={{ color: '#9ca3af' }}>No data yet.</p>
              </div>
            ) : (
              <LineChart data={last7Days} />
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {overviewCards.map((card, i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: card.bg,
                border: `1px solid ${card.border}`,
              }}
            >
              <p className="text-sm font-semibold" style={{ color: '#374151' }}>{card.label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{card.sub}</p>
              <p className="text-4xl font-bold mt-4" style={{ color: card.valueColor }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Quiz Results */}
        <div
          className="rounded-2xl p-5 sm:p-6"
          style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-base font-bold mb-1" style={{ color: '#1f2937' }}>Recent Quiz Results</h2>
          <p className="text-xs mb-4" style={{ color: '#9ca3af' }}>Your latest quiz attempts</p>

          {recentQuizzes.length === 0 ? (
            <p className="text-sm" style={{ color: '#9ca3af' }}>No completed quizzes yet.</p>
          ) : (
            <div className="space-y-1">
              {recentQuizzes.map((q, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 transition"
                  style={{ borderBottom: i < recentQuizzes.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1f2937' }}>
                      {q.subject} — {q.topic}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                      {new Date(q.date).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: q.percentage >= 70 ? '#3b82f6' : '#ef4444' }}>
                      {q.percentage}%
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: q.percentage >= 70 ? '#3b82f6' : '#ef4444' }}
                    >
                      {q.percentage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Progress;