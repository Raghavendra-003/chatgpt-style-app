import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Landing from './routes/Landing.jsx';
import SessionChat from './routes/SessionChat.jsx';
import NotFound from './routes/NotFound.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import { listSessions, startNewSession } from './lib/api.js';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const refreshSessions = async () => {
    try {
      const { sessions } = await listSessions();
      setSessions(sessions);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshSessions();
  }, [location.pathname]);

  const handleNewChat = async () => {
    try {
      const { sessionId } = await startNewSession();
      await refreshSessions();
      navigate(`/session/${sessionId}`);
    } catch (e) {
      console.error(e);
      alert('Failed to start new chat');
    }
  };

  return (
    <div className="flex h-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        sessions={sessions}
        onNewChat={handleNewChat}
        refreshSessions={refreshSessions}

      />
      <div className="flex flex-1 flex-col">
        <TopBar onNewChat={handleNewChat} />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<Landing onNewChat={handleNewChat} />} />
            <Route path="/session/:id" element={<SessionChat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}