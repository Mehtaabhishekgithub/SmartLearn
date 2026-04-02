import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const result = await dispatch(registerUser(form));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Account created!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6 page-enter"
      style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #fdf4ff 50%, #eff6ff 100%)' }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-2 text-xl"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            🎓
          </div>
          <h1
            className="text-xl font-extrabold"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SmartLearn
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>AI-powered learning platform</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-5 sm:p-6"
          style={{
            backgroundColor: '#fff',
            border: '1.5px solid #e9d5ff',
            boxShadow: '0 8px 32px rgba(124,58,237,0.10)',
          }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-bold" style={{ color: '#1f2937' }}>Create Account ✨</h2>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Start your learning journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Name */}
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#7c3aed' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Abhishek Kumar"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
                style={{ border: '1.5px solid #e5e7eb', color: '#1f2937', backgroundColor: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#7c3aed' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
                style={{ border: '1.5px solid #e5e7eb', color: '#1f2937', backgroundColor: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#7c3aed' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition pr-10"
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

              {/* Password strength */}
              {form.password.length > 0 && (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-0.5">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            form.password.length >= level * 4
                              ? level === 1 ? '#ef4444'
                                : level === 2 ? '#f59e0b'
                                  : '#10b981'
                              : '#e5e7eb',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{
                    color: form.password.length < 4 ? '#ef4444'
                      : form.password.length < 8 ? '#f59e0b'
                        : '#10b981'
                  }}>
                    {form.password.length < 4 ? 'Weak'
                      : form.password.length < 8 ? 'Medium'
                        : 'Strong ✓'}
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold transition disabled:opacity-60 active:scale-95 flex items-center justify-center gap-2 mt-1"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                '✨ Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
            <span className="text-xs" style={{ color: '#9ca3af' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#e5e7eb' }} />
          </div>

          {/* Login link */}
          <p className="text-center text-sm" style={{ color: '#6b7280' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold transition hover:opacity-70"
              style={{ color: '#7c3aed' }}
            >
              Login →
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-4" style={{ color: '#9ca3af' }}>
          🔒 Your data is safe and encrypted
        </p>
      </div>
    </div>
  );
};

export default Register;