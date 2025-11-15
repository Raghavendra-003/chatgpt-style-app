import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSession, askQuestion, sendFeedback } from '../lib/api.js';
import ChatInput from '../components/ChatInput.jsx';
import Message from '../components/Message.jsx';
import TableAnswer from '../components/TableAnswer.jsx';

export default function SessionChat() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    try {
      setLoading(true);
      const { session } = await getSession(id);
      setSession(session);
    } catch (e) {
      console.error(e);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, [id]);

  const handleAsk = async (question) => {
    try {
      await askQuestion(id, question);
      await loadSession();
    } catch (e) {
      console.error(e);
      alert('Failed to ask question');
    }
  };

  const handleFeedback = async (answerId, feedback) => {
    try {
      await sendFeedback(id, answerId, feedback);
      await loadSession();
    } catch (e) {
      console.error(e);
      alert('Failed to send feedback');
    }
  };

  if (loading) {
    return <div className="p-4">Loading session...</div>;
  }
  if (!session) {
    return <div className="p-4">Session not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{session.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Session ID: {session.id}
        </p>
      </div>

      <div className="space-y-4">
        {session.messages.map((m) => (
          <div key={m.id} className="rounded border border-gray-200 dark:border-gray-700 p-3">
            {m.role === 'user' ? (
              <Message role="user" content={m.content} timestamp={m.timestamp} />
            ) : (
              <div>
                <Message role="assistant" content={m.content} timestamp={m.timestamp} />
                {m.table && <TableAnswer title={m.table.title} columns={m.table.columns} rows={m.table.rows} />}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleFeedback(m.id, m.feedback === 'like' ? null : 'like')}
                    className={`px-3 py-1 rounded border ${m.feedback === 'like' ? 'bg-green-600 text-white border-green-700' : 'border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/30'}`}
                    title="Like"
                  >
                    👍 Like
                  </button>
                  <button
                    onClick={() => handleFeedback(m.id, m.feedback === 'dislike' ? null : 'dislike')}
                    className={`px-3 py-1 rounded border ${m.feedback === 'dislike' ? 'bg-red-600 text-white border-red-700' : 'border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
                    title="Dislike"
                  >
                    👎 Dislike
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ChatInput onSend={handleAsk} />
      </div>
    </div>
  );
}