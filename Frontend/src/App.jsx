import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import StudyPlan from './pages/StudyPlan.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Quiz from './pages/Quiz.jsx';
import Progress from './pages/Progress.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Notes from './pages/Notes.jsx';
import NotFound from './pages/NotFound.jsx';


const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/study-plan" element={<PrivateRoute><StudyPlan /></PrivateRoute>} />
        <Route path="/quiz"       element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="*"           element={<Navigate to="/login" />} />
        <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
        <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />



      </Routes>
    </BrowserRouter>
  );
};

export default App;