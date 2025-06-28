import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthManager } from './utils/auth';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Children from './components/Children';
import Attendance from './components/Attendance';
import Teachers from './components/Teachers';
import Payments from './components/Payments';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isLoggedIn = AuthManager.isLoggedIn();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="children" element={<Children />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;