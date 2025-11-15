import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const SESSIONS_PATH = path.join(DATA_DIR, 'sessions.json');
const TABLES_PATH = path.join(DATA_DIR, 'mockTables.json');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Utility to read/write sessions
function loadSessions() {
  const raw = readFileSync(SESSIONS_PATH, 'utf-8');
  return JSON.parse(raw).sessions || [];
}
function saveSessions(sessions) {
  writeFileSync(SESSIONS_PATH, JSON.stringify({ sessions }, null, 2), 'utf-8');
}
function loadTables() {
  return JSON.parse(readFileSync(TABLES_PATH, 'utf-8'));
}

// Helpers
function generateTitleFromQuestion(q) {
  const cleaned = q.replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'Untitled session';
  const first = cleaned.split(' ').slice(0, 5).join(' ');
  return first.charAt(0).toUpperCase() + first.slice(1);
}
function pickMockForQuestion(q, tables) {
  const lower = q.toLowerCase();
  if (lower.includes('price') || lower.includes('plan')) return tables.pricing;
  if (lower.includes('user') || lower.includes('segment')) return tables.users;
  return tables.default;
}

// Routes
app.post('/api/sessions', (req, res) => {
  const sessions = loadSessions();
  const id = nanoid(10);
  const newSession = {
    id,
    title: 'New chat',
    createdAt: Date.now(),
    messages: []
  };
  sessions.push(newSession);
  saveSessions(sessions);
  res.json({ sessionId: id });
});

app.get('/api/sessions', (req, res) => {
  const sessions = loadSessions();
  const summary = sessions.map(s => ({
    id: s.id,
    title: s.title || 'Untitled',
    createdAt: s.createdAt,
    messageCount: s.messages.length
  }));
  res.json({ sessions: summary });
});

app.get('/api/sessions/:id', (req, res) => {
  const sessions = loadSessions();
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json({ session });
});

app.post('/api/sessions/:id/question', (req, res) => {
  const { question } = req.body || {};
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const sessions = loadSessions();
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const tables = loadTables();
  const mock = pickMockForQuestion(question, tables);

  const message = {
    id: nanoid(12),
    role: 'user',
    content: question,
    timestamp: Date.now()
  };
  const answer = {
    id: nanoid(12),
    role: 'assistant',
    content: mock.description,
    table: {
      title: mock.title,
      columns: mock.columns,
      rows: mock.rows
    },
    feedback: null, // 'like' | 'dislike' | null
    timestamp: Date.now()
  };

  // Update session title if first question
  if (session.messages.length === 0) {
    session.title = generateTitleFromQuestion(question);
  }

  session.messages.push(message, answer);
  saveSessions(sessions);

  res.json({ answer });
});

app.post('/api/sessions/:sessionId/answers/:answerId/feedback', (req, res) => {
  const { feedback } = req.body || {};
  if (!['like', 'dislike', null].includes(feedback)) {
    return res.status(400).json({ error: 'Feedback must be like, dislike, or null' });
  }

  const sessions = loadSessions();
  const session = sessions.find(s => s.id === req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const answer = session.messages.find(m => m.id === req.params.answerId && m.role === 'assistant');
  if (!answer) return res.status(404).json({ error: 'Answer not found' });

  answer.feedback = feedback;
  saveSessions(sessions);
  res.json({ ok: true });
});

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

app.delete('/api/sessions/:id', (req, res) => {
  const sessions = loadSessions();
  const filtered = sessions.filter(s => s.id !== req.params.id);
  if (filtered.length === sessions.length) {
    return res.status(404).json({ error: 'Session not found' });
  }
  saveSessions(filtered);
  res.json({ ok: true });
});