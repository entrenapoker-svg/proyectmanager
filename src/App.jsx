import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a loading spinner
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <div className="flex bg-[#0a0a0b] min-h-screen text-white font-sans selection:bg-cyan-500/30">
                  <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
                  <TopBar onMenuClick={() => setSidebarOpen(true)} />
                  <Dashboard />
                  <AIAssistant />
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
