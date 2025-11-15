import React, { useState } from 'react';

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const q = value.trim();
    if (!q) return;
    setLoading(true);
    try {
      await onSend(q);
      setValue('');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={2}
        placeholder="Ask your question..."
        className="flex-1 rounded border border-gray-300 dark:border-gray-700 p-2 bg-white dark:bg-gray-900"
      />
      <button
        onClick={send}
        disabled={loading}
        className="px-4 py-2 rounded bg-brand text-white hover:bg-blue-600 disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}