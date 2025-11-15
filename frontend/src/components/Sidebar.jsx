import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ open, onToggle, sessions, onNewChat, refreshSessions }) {
  const location = useLocation();

  // Delete handler
  async function handleDelete(id) {
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      if (typeof refreshSessions === 'function') {
        refreshSessions(); // refresh list after deletion
      }
    } catch (err) {
      console.error('Failed to delete session', err);
      alert('Could not delete session');
    }
  }

  return (
    <aside
      className={`h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-200 ${
        open ? 'w-[var(--sidebar-width)]' : 'w-16'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <span className={`font-semibold ${open ? 'block' : 'hidden'}`}>Sessions</span>
        <button
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-sm"
          onClick={onToggle}
          title="Toggle sidebar"
        >
          {open ? '⟨' : '⟩'}
        </button>
      </div>

      {/* New Chat */}
      <div className="p-2">
        <button
          onClick={onNewChat}
          className={`w-full px-3 py-2 rounded bg-brand text-white hover:bg-blue-600 ${open ? 'block' : 'hidden'}`}
        >
          + New Chat
        </button>
        {!open && (
          <button
            onClick={onNewChat}
            className="w-full px-2 py-2 rounded bg-brand text-white mt-2 hover:bg-blue-600"
            title="New Chat"
          >
            +
          </button>
        )}
      </div>

      {/* Sessions list */}
      <div className="px-2">
        <ul className="space-y-1 overflow-y-auto max-h-[65vh] scroll-thin">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between">
              <Link
                to={`/session/${s.id}`}
                className={`flex-1 px-2 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  location.pathname.includes(s.id) ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
                title={s.title}
              >
                {open ? (
                  <div className="flex justify-between">
                    <span className="truncate">{s.title}</span>
                    <span className="text-gray-400">{s.messageCount}</span>
                  </div>
                ) : (
                  <span>💬</span>
                )}
              </Link>

              {/* Delete button (only visible when sidebar is open) */}
              {open && (
                <button
                  onClick={() => {
                    if (window.confirm('Delete this chat?')) {
                      handleDelete(s.id);
                    }
                  }}
                  className="ml-2 px-2 py-1 text-xs rounded border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                  title="Delete session"
                >
                  🗑
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-3 border-t border-gray-200 dark:border-gray-800">
        {open ? (
          <div className="text-xs text-gray-500">
            <div className="font-semibold mb-1">User</div>
            <div>Raghavendra</div>
            <div className="text-[10px] mt-1">Hayathnagar, Telangana</div>
          </div>
        ) : (
          <div className="text-center text-xs text-gray-500">👤</div>
        )}
      </div>
    </aside>
  );
}