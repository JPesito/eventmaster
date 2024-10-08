import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import CalendarDashboard from './components/CalendarDashboard';
import Home from './components/Home';
import Navbar from './components/Navbar';
import SuccessMessage from './components/SuccessMessage';
import HomeReports from './components/reports/HomeReports';
import FormReservation from './components/FormReservation'
import LoginUsers from './components/login/LoginUsers';
import ProtectedRoute from './components/login/ProtectedRoute';
import './styles.css'; 

const App = () => {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
};


const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginUsers />} />
          <Route path="/events" element={<CalendarDashboard />} />
          <Route path="/form-reservation" element={<FormReservation />} />
          <Route path="/reports" element={<HomeReports />} />
          <Route path="/about" element={<About />} />
          <Route path="/success" element={<SuccessMessage />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const About = () => <h2>Acerca de</h2>;

export default App;
