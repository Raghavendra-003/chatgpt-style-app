export async function startNewSession() {
  const res = await fetch('/api/sessions', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start session');
  return res.json();
}

export async function listSessions() {
  const res = await fetch('/api/sessions');
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function getSession(id) {
  const res = await fetch(`/api/sessions/${id}`);
  if (!res.ok) throw new Error('Session not found');
  return res.json();
}

export async function askQuestion(sessionId, question) {
  const res = await fetch(`/api/sessions/${sessionId}/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error('Failed to ask question');
  return res.json();
}

export async function sendFeedback(sessionId, answerId, feedback) {
  const res = await fetch(`/api/sessions/${sessionId}/answers/${answerId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feedback })
  });
  if (!res.ok) throw new Error('Failed to send feedback');
  return res.json();
}