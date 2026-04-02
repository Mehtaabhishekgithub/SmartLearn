import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-6xl font-bold text-gray-800 mb-3">404</h1>
        <p className="text-xl text-gray-500 mb-2">Page not found</p>
        <p className="text-sm text-gray-400 mb-8">
          Yeh page exist nahi karta ya move ho gaya hai
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;