const express = require('express');
const router = express.Router();
const store = require('../data/envelopes');

// GET /envelopes/total — total budget (must be before /:id)
router.get('/total', (req, res) => {
  res.json({ totalBudget: store.getTotalBudget() });
});

// GET /envelopes — all envelopes
router.get('/', (req, res) => {
  res.json(store.getAll());
});

// GET /envelopes/:id — one envelope
router.get('/:id', (req, res) => {
  const env = store.getById(Number(req.params.id));
  if (!env) return res.status(404).json({ error: 'Envelope not found' });
  res.json(env);
});

// POST /envelopes — create
router.post('/', (req, res) => {
  const { name, budget } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Envelope name is required' });
  }
  if (typeof budget !== 'number' || budget <= 0) {
    return res.status(400).json({ error: 'Budget must be a positive number' });
  }
  const env = store.create(name.trim(), budget);
  res.status(201).json({
    message: 'Envelope created',
    envelope: env,
    totalBudget: store.getTotalBudget()
  });
});

// PUT /envelopes/:id — update
router.put('/:id', (req, res) => {
  const env = store.update(Number(req.params.id), req.body);
  if (!env) return res.status(404).json({ error: 'Envelope not found' });
  res.json(env);
});

// DELETE /envelopes/:id — delete
router.delete('/:id', (req, res) => {
  const ok = store.remove(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: 'Envelope not found' });
  res.status(204).send();
});

// POST /envelopes/:id/spend
router.post('/:id/spend', (req, res) => {
  const amount = Number(req.body.amount);
  const env = store.getById(Number(req.params.id));
  if (!env) return res.status(404).json({ error: 'Envelope not found' });
  if (!amount || amount <= 0 || amount > env.balance) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  env.balance -= amount;
  res.json(env);
});

// POST /envelopes/:id/fund
router.post('/:id/fund', (req, res) => {
  const amount = Number(req.body.amount);
  const env = store.getById(Number(req.params.id));
  if (!env) return res.status(404).json({ error: 'Envelope not found' });
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  env.balance += amount;
  res.json(env);
});

module.exports = router;