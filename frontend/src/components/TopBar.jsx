import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import { Link } from 'react-router-dom';

export default function TopBar({ onNewChat }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <div className="flex items-center gap-3">
        <Link to="/" className="font-semibold">Chat App</Link>
        <button
          onClick={onNewChat}
          className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          New Chat
        </button>
      </div>
      <ThemeToggle />
    </header>
  );
}