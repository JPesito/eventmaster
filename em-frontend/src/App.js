import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import ProtectedAdminRoute from './components/routes/ProtectedAdminRoute';
import Navbar from './components/navbar/Navbar';
import HomeReport from './components/report/HomeReport';
import HomeUser from './components/users/HomeUser';
import WeeklyScheduler from './components/calendar/directory/WeeklyScheduler';
import ReadOnlyHomeUser from './components/calendar/board/ReadOnlyHomeUser'
import LoginUsers from './components/login/LoginUsers';
import ResetPassword from './components/login/ResetPassword';
import HomeAdmin from './components/users/HomeAdmin';
import HomeInit from './components/dashboard/HomeInit';
import EventsList from './components/EventsList';
import Home from './components/Home';
import './styles.css';
import HomeTeacherScheduler from './components/users/HomeTeacherScheduler';

const App = () => {
  return (
    <Router>
      {/* Coloca AuthProvider dentro del Router */}
      <AuthProvider>
        <Navbar />
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Routes location={location}>
            {/* Rutas públicas */}
            <Route path="/" element={<HomeInit />} />
            <Route path="/login" element={<LoginUsers />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Home />} />
            <Route path="/board" element={<ReadOnlyHomeUser />} />

            {/* Rutas protegidas */}
            <Route path="/home" element={<ProtectedRoute><HomeUser /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><WeeklyScheduler /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><HomeReport /></ProtectedRoute>} />
            <Route path="/teacher-scheduler" element={<ProtectedRoute><HomeTeacherScheduler /></ProtectedRoute>} />
            <Route path="/events/teacher/:teacherId" element={<ProtectedRoute><EventsList /></ProtectedRoute>} />

            {/* Rutas administrativas protegidas */}
            <Route path="/admin" element={<ProtectedAdminRoute><HomeAdmin /></ProtectedAdminRoute>} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default App;
