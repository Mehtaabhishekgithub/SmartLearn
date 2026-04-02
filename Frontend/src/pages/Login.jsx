import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 page-enter"
      style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #fdf4ff 50%, #eff6ff 100%)' }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            🎓
          </div>
          <h1
            className="text-2xl font-extrabold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            SmartLearn
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>AI-powered learning platform</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-7 sm:p-8"
          style={{
            backgroundColor: '#fff',
            border: '1.5px solid #e9d5ff',
            boxShadow: '0 8px 32px rgba(124,58,237,0.10)',
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#1f2937' }}>Welcome back 👋</h2>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Login to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#7c3aed' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                style={{ border: '1.5px solid #e5e7eb', color: '#1f2937', backgroundColor: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#7c3aed' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition pr-12"
                  style={{ border: '1.5px solid #e5e7eb', color: '#1f2937', backgroundColor: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: '#9ca3af' }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition disabled:opacity-60 active:scale-95 flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                '🚀 Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
            <span className="text-xs" style={{ color: '#9ca3af' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Register link */}
          <p className="text-center text-sm" style={{ color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold transition hover:opacity-70"
              style={{ color: '#7c3aed' }}
            >
              Create one →
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: '#9ca3af' }}>
          🔒 Your data is safe and encrypted
        </p>
      </div>
    </div>
  );
};

export default Login;