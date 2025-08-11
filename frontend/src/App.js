import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { UserProvider } from './contexts/UserContext';
import './App.css';

// Pages
import Home from './pages/Home';
import TakeTest from './pages/TakeTest';
import TestResults from './pages/TestResults';
import Profile from './pages/Profile';
import Daily from './pages/Daily';
import Library from './pages/Library';
import Settings from './pages/Settings';

// Layout
import Layout from './components/Layout';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test/:testId" element={<TakeTest />} />
              <Route path="/results/:testId" element={<TestResults />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/library" element={<Library />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;