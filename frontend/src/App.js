import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Pages - Personal Blueprint AI Flow
import HomePage from './pages/HomePage';
import IntakePage from './pages/IntakePage';
import TestsHubPage from './pages/TestsHubPage';
import ImportPage from './pages/ImportPage';
import SynthesisPage from './pages/SynthesisPage';
import DailyPage from './pages/DailyPage';
import AskAIPage from './pages/AskAIPage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';
import PremiumPage from './pages/PremiumPage';

// Support pages
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <Router>
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Main App Flow */}
            <Route path="/" element={<HomePage />} />
            <Route path="/intake" element={<IntakePage />} />
            <Route path="/tests" element={<TestsHubPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/synthesis" element={<SynthesisPage />} />
            <Route path="/daily" element={<DailyPage />} />
            <Route path="/ask-ai" element={<AskAIPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Support Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </Router>
    </div>
  );
}

export default App;