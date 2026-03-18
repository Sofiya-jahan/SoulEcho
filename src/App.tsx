import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import WriteEntry from './pages/WriteEntry';
import EntryHistory from './pages/EntryHistory';
import CalendarView from './pages/CalendarView';
import MonthlyAnalysis from './pages/MonthlyAnalysis';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#f9f9f7]">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/write" 
              element={
                <ProtectedRoute>
                  <WriteEntry />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <EntryHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <CalendarView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analysis" 
              element={
                <ProtectedRoute>
                  <MonthlyAnalysis />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="mt-24 py-12 text-center text-gray-400 text-xs px-4">
          <div className="max-w-lg mx-auto">
            <p className="mb-2">SoulEcho is an AI tool for self-reflection. It is not a substitute for professional mental health care.</p>
            <p>If you are experiencing extreme distress, please reach out to a trusted friend, family member, or a professional support service.</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
