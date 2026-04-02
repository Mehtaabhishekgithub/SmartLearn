import { useState, useEffect } from 'react';
import { generatePlan, getMyPlans, markTopicComplete, deletePlan } from '../services/studyPlanService.js';
import toast from 'react-hot-toast';

const StudyPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({ subject: '', days: 7 });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await getMyPlans();
      setPlans(res.data.plans);
      if (res.data.plans.length > 0) setSelectedPlan(res.data.plans[0]);
    } catch {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await generatePlan(form);
      setPlans([res.data.plan, ...plans]);
      setSelectedPlan(res.data.plan);
      toast.success('Study plan generated!');
      setForm({ subject: '', days: 7 });
    } catch {
      toast.error('Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkComplete = async (planId, topicIndex) => {
    try {
      const res = await markTopicComplete(planId, topicIndex);
      const updated = res.data.plan;
      setPlans(plans.map(p => p._id === updated._id ? updated : p));
      setSelectedPlan(updated);
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      const remaining = plans.filter(p => p._id !== id);
      setPlans(remaining);
      if (selectedPlan?._id === id) setSelectedPlan(remaining[0] || null);
      toast.success('Plan deleted!');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const completedCount = selectedPlan?.topics.filter(t => t.completed).length || 0;
  const progressPercent = selectedPlan
    ? Math.round((completedCount / selectedPlan.topics.length) * 100)
    : 0;

  return (
    <div
      className="min-h-screen page-enter"
      style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #fdf4ff 50%, #eff6ff 100%)' }}
    >
      {/* Navbar */}
      <div
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'rgba(255,255,255,0.75)',
          borderBottom: '1px solid #e9d5ff',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              AI Study Plan
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
              Generate a personalized study plan
            </p>
          </div>
          
           <a href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition hover:bg-purple-50"
            style={{ border: '1.5px solid #7c3aed', color: '#7c3aed' }}
          >
            <span>⊞</span>
            <span>Dashboard</span>
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Panel */}
          <div className="space-y-5">

            {/* Generate Form */}
            <div
              className="rounded-3xl p-6"
              style={{
                backgroundColor: '#fff',
                border: '1.5px solid #e9d5ff',
                boxShadow: '0 4px 24px rgba(124,58,237,0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                >
                  ✨
                </div>
                <h2 className="text-lg font-bold" style={{ color: '#1f2937' }}>
                  Generate New Plan
                </h2>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#7c3aed' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JavaScript, React, DSA"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                    style={{ border: '1.5px solid #e5e7eb', color: '#1f2937' }}
                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#7c3aed' }}>
                    Number of Days
                  </label>
                  <select
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ border: '1.5px solid #e5e7eb', color: '#1f2937' }}
                  >
                    {[3, 5, 7, 10, 14].map(d => (
                      <option key={d} value={d}>{d} Days</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full py-3.5 rounded-xl text-sm font-bold transition disabled:opacity-60 active:scale-95 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>✨ Generate Plan</>
                  )}
                </button>
              </form>
            </div>

            {/* My Plans List */}
            <div
              className="rounded-3xl p-5"
              style={{
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                boxShadow: '0 4px 24px rgba(22,163,74,0.06)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">📖</span>
                <h2 className="text-base font-bold" style={{ color: '#15803d' }}>My Plans</h2>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#6b7280' }}>
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : plans.length === 0 ? (
                <p className="text-sm" style={{ color: '#9ca3af' }}>No plans yet. Generate one!</p>
              ) : (
                <div className="space-y-2">
                  {plans.map(plan => (
                    <div
                      key={plan._id}
                      onClick={() => setSelectedPlan(plan)}
                      className="p-3 rounded-2xl cursor-pointer transition flex items-center justify-between group"
                      style={{
                        backgroundColor: selectedPlan?._id === plan._id ? '#fff' : 'transparent',
                        border: selectedPlan?._id === plan._id ? '1.5px solid #86efac' : '1.5px solid transparent',
                      }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#15803d' }}>{plan.subject}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{plan.topics.length} days</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#86efac' }}>›</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(plan._id); }}
                          className="opacity-0 group-hover:opacity-100 transition p-1 rounded-lg hover:bg-red-50"
                          style={{ color: '#f87171' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-4">
            {selectedPlan ? (
              <>
                {/* Plan Header Card */}
                <div
                  className="rounded-3xl p-6"
                  style={{
                    backgroundColor: '#eff6ff',
                    border: '1.5px solid #bfdbfe',
                    boxShadow: '0 4px 24px rgba(59,130,246,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-extrabold" style={{ color: '#1d4ed8' }}>
                        {selectedPlan.subject}
                      </h2>
                      <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
                        {selectedPlan.topics.length}-day study plan
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedPlan._id)}
                      className="p-2 rounded-xl transition hover:bg-red-50"
                      style={{ color: '#f87171' }}
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold" style={{ color: '#374151' }}>Progress</span>
                      <span className="text-sm font-bold" style={{ color: '#1d4ed8' }}>
                        {progressPercent}% complete
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#dbeafe' }}>
                      <div
                        className="h-3 rounded-full transition-all duration-700"
                        style={{
                          width: `${progressPercent}%`,
                          background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: '#6b7280' }}>
                      {completedCount}/{selectedPlan.topics.length} completed
                    </p>
                  </div>
                </div>

                {/* Topics */}
                <div className="space-y-3">
                  {selectedPlan.topics.map((topic, index) => (
                    <div
                      key={topic._id}
                      className="rounded-2xl p-4 flex items-start gap-4 transition-all duration-300"
                      style={{
                        backgroundColor: topic.completed ? '#f0fdf4' : '#fff',
                        border: `1.5px solid ${topic.completed ? '#bbf7d0' : '#e0e7ff'}`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => handleMarkComplete(selectedPlan._id, index)}
                        className="mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={{
                          backgroundColor: topic.completed ? '#22c55e' : '#fff',
                          borderColor: topic.completed ? '#22c55e' : '#d1d5db',
                        }}
                      >
                        {topic.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: topic.completed ? '#dcfce7' : '#ede9fe',
                              color: topic.completed ? '#15803d' : '#7c3aed',
                            }}
                          >
                            Day {topic.day}
                          </span>
                          <p
                            className="text-sm font-semibold"
                            style={{
                              color: topic.completed ? '#9ca3af' : '#1f2937',
                              textDecoration: topic.completed ? 'line-through' : 'none',
                            }}
                          >
                            {topic.title}
                          </p>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div
                className="rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-64"
                style={{ backgroundColor: '#fff', border: '1.5px solid #e9d5ff' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                  style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)' }}
                >
                  📋
                </div>
                <p className="font-semibold mb-1" style={{ color: '#374151' }}>No plan selected</p>
                <p className="text-sm" style={{ color: '#9ca3af' }}>
                  Generate a new plan or select one from My Plans
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;