import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplitCard from './components/layout/SplitCard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import RegisterPage from './components/layout/RegisterPage';
import HeroIllustration from './components/layout/HeroIllustration';
import RegisterIllustration from './components/layout/RegisterIllustration';
import ForgotPassword from "./components/auth/ForgotPassword";
import ContactPage from "./components/layout/ContactPage";
import './index.css';

import Dashboard from './components/dashboard/Dashboard';

import UserProfile from './components/profile/UserProfile';
import MessagingPage from './components/messaging/MessagingPage';
import NetworkPage from './components/network/NetworkPage';
import EventsPage from './components/events/EventsPage';
import ApplicationsPage from './components/applications/ApplicationsPage';
import OpportunityForm from './components/opportunities/OpportunityForm';

import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UnauthorizedPage from './components/layout/UnauthorizedPage';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <div className="app-container">
          <Routes>
            {/* Login Route */}
            <Route path="/" element={
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SplitCard
                  leftContent={<HeroIllustration />}
                  rightContent={<LoginForm />}
                />
              </div>
            } />
            <Route path="/forgot-password" element={
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ForgotPassword />
              </div>
            } />

            {/* Register Route */}
            <Route path="/register" element={<RegisterPage />} />

            {/* Unauthorized Page (public) */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/network" element={<ProtectedRoute><NetworkPage /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
            <Route path="/events/create" element={<ProtectedRoute><OpportunityForm /></ProtectedRoute>} />
            <Route path="/events/edit/:id" element={<ProtectedRoute><OpportunityForm /></ProtectedRoute>} />
          </Routes>
        </div>
      </NotificationProvider>
    </Router>
  );
}

export default App;
