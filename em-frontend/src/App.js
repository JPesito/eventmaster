import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import ProtectedAdminRoute from './components/routes/ProtectedAdminRoute';
import WeeklyScheduler from './components/WeeklyScheduler';
import Navbar from './components/navbar/Navbar';
import HomeReport from './components/report/HomeReport';
import HomeUser from './components/users/HomeUser';
import LoginUsers from './components/login/LoginUsers';
import ResetPassword from './components/login/ResetPassword';
import HomeAdmin from './components/users/HomeAdmin';
import HomeInit from './components/dashboard/HomeInit';
import EventsList from './components/EventsList';
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
            <Route path="/about" element={<About />} />

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

// Ruta "Acerca de"
const About = () => <h2>Acerca de</h2>;

export default App;
