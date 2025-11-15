import React from 'react';

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function Message({ role, content, timestamp }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded p-3 text-sm ${
        isUser
          ? 'bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800'
          : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      }`}>
        <div className="whitespace-pre-wrap">{content}</div>
        <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">{formatTime(timestamp)}</div>
      </div>
    </div>
  );
}