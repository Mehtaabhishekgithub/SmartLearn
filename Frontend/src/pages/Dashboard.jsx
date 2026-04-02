import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/authSlice.js';
import { getProgress } from '../services/progressService.js';
import studentImg from '../assets/student.png';

const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.quizzes), 1);
  return (
    <div className="flex items-end justify-between gap-1 mt-3" style={{ height: '120px' }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <div
            className="w-full rounded-t-lg transition-all duration-700"
            style={{
              height: `${(d.quizzes / max) * 100}px`,
              minHeight: d.quizzes > 0 ? '6px' : '2px',
              background: d.quizzes > 0
                ? 'linear-gradient(180deg, #60a5fa, #3b82f6)'
                : '#f1f5f9',
            }}
          />
          <span className="text-xs" style={{ color: '#9ca3af', fontSize: '10px' }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.quizzes), 1);
  const points = data.map((d, i) => ({
    x: 40 + (i * (320 / (data.length - 1))),
    y: 110 - ((d.quizzes / max) * 90),
  }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width="100%" viewBox="0 0 400 140" className="mt-3">
      {[0, 20, 40, 60, 80].map((val, i) => (
        <g key={i}>
          <line x1="40" y1={110 - (val / 80) * 90} x2="380" y2={110 - (val / 80) * 90}
            stroke="#f1f5f9" strokeWidth="1" />
          <text x="32" y={114 - (val / 80) * 90} fontSize="8" fill="#9ca3af" textAnchor="end">{val}</text>
        </g>
      ))}
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
          <circle cx={p.x} cy={p.y} r="2" fill="#fff" />
          <text x={p.x} y="128" fontSize="8" fill="#9ca3af" textAnchor="middle">
            {`W${i + 1}`}
          </text>
        </g>
      ))}
    </svg>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getProgress();
        setStats(res.data);
      } catch {}
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const navFeatures = [
    { label: 'AI Study Plan', path: '/study-plan', icon: '📚' },
    { label: 'AI Quiz', path: '/quiz', icon: '🧠' },
    { label: 'Progress', path: '/progress', icon: '📊' },
    { label: 'My Notes', path: '/notes', icon: '📝' },
  ];

  const features = [
    {
      title: 'AI Study Plan',
      desc: 'Generate a personalized day-by-day study plan for any subject using AI',
      icon: '📚',
      border: '#7c3aed',
      iconBg: '#f5f3ff',
      textColor: '#7c3aed',
      tagBg: '#ede9fe',
      tagColor: '#7c3aed',
      path: '/study-plan',
      tag: 'Most Used',
    },
    {
      title: 'AI Quiz',
      desc: 'Test your knowledge with AI-generated MCQ quizzes on any topic',
      icon: '🧠',
      border: '#3b82f6',
      iconBg: '#eff6ff',
      textColor: '#3b82f6',
      tagBg: '#dbeafe',
      tagColor: '#1d4ed8',
      path: '/quiz',
      tag: 'Practice',
    },
    {
      title: 'Progress',
      desc: 'Track your quiz scores, streaks and weekly learning activity',
      icon: '📊',
      border: '#10b981',
      iconBg: '#f0fdf4',
      textColor: '#10b981',
      tagBg: '#dcfce7',
      tagColor: '#15803d',
      path: '/progress',
      tag: 'Analytics',
    },
    {
      title: 'My Notes',
      desc: 'Create, search and manage your personal study notes with tags',
      icon: '📝',
      border: '#f59e0b',
      iconBg: '#fffbeb',
      textColor: '#f59e0b',
      tagBg: '#fef3c7',
      tagColor: '#b45309',
      path: '/notes',
      tag: 'Notes',
    },
  ];

  const statCards = [
    {
      label: 'TOTAL QUIZZES',
      value: stats ? stats.quizStats.totalQuizzes : null,
      suffix: '',
      valueColor: '#1f2937',
      icon: '📖',
      iconBg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    },
    {
      label: 'AVG SCORE',
      value: stats ? stats.quizStats.avgScore : null,
      suffix: '%',
      valueColor: '#10b981',
      icon: '📈',
      iconBg: 'linear-gradient(135deg, #10b981, #06b6d4)',
    },
    {
      label: 'BEST SCORE',
      value: stats ? stats.quizStats.bestScore : null,
      suffix: '%',
      valueColor: '#f59e0b',
      icon: '🏆',
      iconBg: 'linear-gradient(135deg, #f59e0b, #f97316)',
    },
    {
      label: 'DAY STREAK',
      value: stats ? stats.streak : null,
      suffix: '',
      valueColor: '#f97316',
      icon: '🔥',
      iconBg: 'linear-gradient(135deg, #ef4444, #f97316)',
    },
  ];

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: '#f8fafc' }}>

      {/* Navbar */}
      <nav
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderBottom: '1px solid #e9d5ff',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="w-full px-4 sm:px-6 py-3 flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
            >
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div>
              <span className="text-sm font-bold" style={{ color: '#7c3aed' }}>SmartLearn</span>
              <p className="text-xs" style={{ color: '#9ca3af' }}>Learning Made Smart</p>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="hidden lg:flex items-center gap-1">
            {navFeatures.map((f) => (
              <button
                key={f.path}
                onClick={() => navigate(f.path)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition"
                style={{ color: '#6b7280' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold" style={{ color: '#1f2937' }}>{user?.name}</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>{user?.email}</p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold hidden sm:flex"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
            >
              {user?.name?.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition"
              style={{ color: '#ef4444', border: '1px solid #fecaca', backgroundColor: '#fff5f5' }}
            >
              + Logout
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg transition"
              style={{ color: '#6b7280' }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden px-4 py-3 flex flex-col gap-1" style={{ borderTop: '1px solid #f3f4f6' }}>
            {navFeatures.map((f) => (
              <button
                key={f.path}
                onClick={() => { navigate(f.path); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left"
                style={{ color: '#6b7280' }}
              >
                <span>{f.icon}</span>{f.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="w-full px-4 sm:px-6 py-6 sm:py-8">

        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-5 sm:p-6 mb-6 flex items-center gap-4 sm:gap-6"
          style={{
            background: 'linear-gradient(135deg, #f5f3ff, #eff6ff)',
            border: '1px solid #ddd6fe',
          }}
        >
          <img
            src={studentImg}
            alt="student"
            className="w-16 sm:w-20 md:w-24 object-contain flex-shrink-0"
          />
          <div>
            <h1 className="text-lg sm:text-2xl font-bold" style={{ color: '#1f2937' }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              What would you like to learn today?
            </p>
            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: '#7c3aed' }}>
              🎯 Keep learning consistently to build your streak and improve your scores!
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
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
              {stat.value === null ? (
                <div className="w-16 h-8 rounded animate-pulse" style={{ backgroundColor: '#f1f5f9' }} />
              ) : (
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: stat.valueColor }}>
                  {stat.value}{stat.suffix}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h2 className="text-sm font-bold" style={{ color: '#1f2937' }}>Quizzes This Week</h2>
            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Daily quiz activity</p>
            {stats ? (
              stats.last7Days.every(d => d.quizzes === 0) ? (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-sm" style={{ color: '#9ca3af' }}>No activity this week!</p>
                </div>
              ) : (
                <BarChart data={stats.last7Days} />
              )
            ) : (
              <div className="h-32 animate-pulse rounded-xl mt-3" style={{ backgroundColor: '#f1f5f9' }} />
            )}
          </div>

          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h2 className="text-sm font-bold" style={{ color: '#1f2937' }}>Progress Over Time</h2>
            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Your average scores by week</p>
            {stats ? (
              stats.last7Days.every(d => d.quizzes === 0) ? (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-sm" style={{ color: '#9ca3af' }}>No data yet.</p>
                </div>
              ) : (
                <LineChart data={stats.last7Days} />
              )
            ) : (
              <div className="h-32 animate-pulse rounded-xl mt-3" style={{ backgroundColor: '#f1f5f9' }} />
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Study Plans Created', sub: 'Total plans', value: stats?.studyStats.totalPlans, bg: '#f5f3ff', border: '#ddd6fe', color: '#7c3aed' },
            { label: 'Quizzes Completed', sub: `Out of ${stats?.quizStats.totalQuizzes ?? 0} total`, value: stats?.quizStats.completedQuizzes, bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a' },
            { label: 'Current Streak', sub: 'Consecutive days', value: stats ? `${stats.streak} 🔥` : null, bg: '#fff7ed', border: '#fed7aa', color: '#ea580c' },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{ backgroundColor: card.bg, border: `1px solid ${card.border}` }}
            >
              <p className="text-sm font-semibold" style={{ color: '#374151' }}>{card.label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{card.sub}</p>
              {card.value === null || card.value === undefined ? (
                <div className="w-12 h-8 rounded animate-pulse mt-4" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} />
              ) : (
                <p className="text-4xl font-bold mt-4" style={{ color: card.color }}>{card.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9ca3af' }}>
            FEATURES
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="rounded-2xl p-4 sm:p-5 cursor-pointer transition group"
              style={{
                backgroundColor: '#fff',
                border: '1px solid #f1f5f9',
                borderLeft: `4px solid ${feature.border}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: feature.iconBg }}
                >
                  {feature.icon}
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: feature.tagBg, color: feature.tagColor }}
                >
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold mb-1" style={{ color: feature.textColor }}>
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b7280' }}>
                {feature.desc}
              </p>
              <p className="text-xs font-medium" style={{ color: feature.textColor }}>
                Open →
              </p>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div
          className="rounded-2xl p-5 sm:p-6"
          style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
              style={{ backgroundColor: '#f5f3ff' }}
            >
              💡
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-3 text-sm sm:text-base" style={{ color: '#7c3aed' }}>
                Pro Tip — How to use SmartLearn effectively
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {[
                  { icon: '📚', color: '#7c3aed', title: 'Start with a Study Plan.', desc: 'Generate an AI-powered plan for your subject to stay organized and on track.' },
                  { icon: '🧠', color: '#3b82f6', title: 'Quiz yourself daily.', desc: 'Take topic-wise MCQ quizzes to test your understanding and retain concepts better.' },
                  { icon: '📈', color: '#10b981', title: 'Track your progress.', desc: 'Monitor your scores, streaks and weekly activity to see how far you have come.' },
                  { icon: '📝', color: '#f59e0b', title: 'Save important notes.', desc: 'Write and tag your notes for quick revision before exams.' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-sm flex-shrink-0 mt-0.5">{tip.icon}</span>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                      <span className="font-semibold" style={{ color: '#1f2937' }}>{tip.title}</span> {tip.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Quiz Results */}
        {stats?.recentQuizzes?.length > 0 && (
          <div
            className="rounded-2xl p-5 sm:p-6 mt-6"
            style={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <h2 className="text-sm font-bold mb-1" style={{ color: '#1f2937' }}>Recent Quiz Results</h2>
            <p className="text-xs mb-4" style={{ color: '#9ca3af' }}>Your latest quiz attempts</p>
            <div className="space-y-1">
              {stats.recentQuizzes.map((q, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < stats.recentQuizzes.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1f2937' }}>
                      {q.subject} — {q.topic}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                      {new Date(q.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
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
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;