import React from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import { ProjectProvider } from './context/ProjectContext';

function App() {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <ProjectProvider>
      <div className="flex bg-[#0a0a0b] min-h-screen text-white font-sans selection:bg-cyan-500/30">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <Dashboard />
        <AIAssistant />
      </div>
    </ProjectProvider>
  );
}

export default App;
