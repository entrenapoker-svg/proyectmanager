import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import MentalGym from './pages/MentalGym';
import AIAssistant from './components/AIAssistant';
import { ErrorBoundary } from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  // New Flex Layout: Sidebar | ContentColumn
  const Layout = ({ children }) => (
    <div className="flex bg-[#0a0a0b] min-h-screen font-sans selection:bg-cyan-500/30 text-white overflow-hidden">
      {/* Helper to keep Sidebar static/fixed behavior working with flex */}
      <div className="flex-shrink-0">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        {/* TopBar is now part of the flow, no longer fixed relative to window */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto relative p-0">
          {children}
          <AIAssistant />
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/admin" element={
                <PrivateRoute>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </PrivateRoute>
              } />

              <Route path="/" element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } />

              <Route path="/gym" element={
                <PrivateRoute>
                  <Layout>
                    <MentalGym />
                  </Layout>
                </PrivateRoute>
              } />
            </Routes>
          </ErrorBoundary>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
