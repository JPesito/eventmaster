import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { AuthProvider } from './components/context/AuthContext';
import WeeklyScheduler from './components/WeeklyScheduler';
import Home from './components/Home';
import Navbar from './components/navbar/Navbar';
import SuccessMessage from './components/SuccessMessage';
import HomeReports from './components/reports/HomeReports';
import HomeUser from './components/users/HomeUser';
import LoginUsers from './components/login/LoginUsers';
import ResetPassword from './components/login/ResetPassword';
import HomeAdmin from './components/users/HomeAdmin';
import HomeInit from './components/dashboard/HomeInit';
import ProtectedAdminRoute from './components/login/ProtectedAdminRoute';
import EventsList from './components/EventsList';
import './styles.css'; 
import HomeTeacherScheduler from './components/users/HomeTeacherScheduler';
import ClasePadre from './components/test/ClasePadre';
import TaskManager from './components/test/ClasePadre';
import Timer from './components/test/ClasePadre';
import ListaDeTareas from './components/test/ListaDeTareas';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route path="/" element={<HomeInit />} />
          <Route path="/register" element={<Home />} />
          
          <Route path="/events" element={<WeeklyScheduler />} />
          <Route path="/home" element={<HomeUser />} />
          <Route path="/reports" element={<HomeReports />} />
          <Route path="/about" element={<About />} />
          <Route path="/success" element={<SuccessMessage />} />
          <Route path="/teacher-scheduler" element={<HomeTeacherScheduler />} />
          <Route path="/events/teacher/:teacherId" element={<EventsList />} />
          
          <Route path="/admin" element={<ProtectedAdminRoute element={<HomeAdmin />} />} />

          {/* Rutas Login */}
          <Route path="/login" element={<LoginUsers />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Ruta para laboratorio */}
          <Route path="/labs" element={<ListaDeTareas />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/timer" element={<Timer />} />

        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const About = () => <h2>Acerca de</h2>;

export default App;