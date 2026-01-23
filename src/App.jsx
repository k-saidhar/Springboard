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

function App() {
  return (
    <Router>
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

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<ContactPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
