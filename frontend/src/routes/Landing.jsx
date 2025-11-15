import React from 'react';

export default function Landing({ onNewChat }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-semibold mb-2">Start a new chat</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Ask a question and get a structured answer with tables and descriptions.
        </p>
        <button
          onClick={onNewChat}
          className="px-5 py-2 rounded bg-brand text-white hover:bg-blue-600"
        >
          New Chat
        </button>
      </div>
    </div>
  );
}