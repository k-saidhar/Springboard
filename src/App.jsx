import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplitCard from './components/layout/SplitCard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import RegisterPage from './components/layout/RegisterPage';
import HeroIllustration from './components/layout/HeroIllustration';
import RegisterIllustration from './components/layout/RegisterIllustration';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Login Route */}
          <Route path="/" element={
            <SplitCard
              leftContent={<HeroIllustration />}
              rightContent={<LoginForm />}
            />
          } />

          {/* Register Route */}
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
