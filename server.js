import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import jwt from 'jsonwebtoken';



const app = express();
const db = new sqlite3.Database('./users.db');
const SECRET = 'e0fe50425c81f3cbd720dbce775f1143eef1bbe503ee44d946b86b04dcb09f5d';

app.use(cors());
app.use(express.json());

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)');

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (user) return res.status(400).json({ error: 'Email already registered' });
    const hash = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], function (err) {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ success: true });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

app.get('/api/user', auth, (req, res) => {
  res.json({ email: req.user.email });
});

// Forgot password endpoint
app.post('/api/forgot-password', (req, res) => {
  const { email, newPassword } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('DB error:', err);
      return res.json({ success: true });
    }
    if (!user) {
      return res.json({ success: true });
    }
    const hash = bcrypt.hashSync(newPassword, 10);
    db.run('UPDATE users SET password = ? WHERE email = ?', [hash, email], function (err) {
      if (err) {
        console.error('DB error:', err);
        return res.json({ success: true });
      }
      return res.json({ success: true });
    });
  });
});

app.listen(4000, () => console.log('API running on http://localhost:4000'));
