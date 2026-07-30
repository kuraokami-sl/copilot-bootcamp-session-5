const express = require('express');
const cors = require('cors');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for TODOs
// INTENTIONAL ISSUE: This should be initialized as an empty array
let todos = [];

// INTENTIONAL ISSUE: Missing counter for ID generation
let nextId = 1;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /api/todos - Get all todos
// INTENTIONAL ISSUE: This endpoint has a bug - it doesn't handle the case when todos is null
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST /api/todos - Create a new todo
// INTENTIONAL ISSUE: Missing implementation
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  
  // Validate title is provided and not empty
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  // Create new todo with generated ID
  const newTodo = {
    id: nextId++,
    title: title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id - Update a todo
// INTENTIONAL ISSUE: Missing implementation
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;
  
  const todo = todos.find((t) => t.id === id);
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  // Update title if provided
  if (title !== undefined) {
    todo.title = title;
  }
  
  res.json(todo);
});

// PATCH /api/todos/:id/toggle - Toggle todo completion status
// INTENTIONAL ISSUE: Has a logical bug
app.patch('/api/todos/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // INTENTIONAL BUG: This always sets to true instead of toggling
  todo.completed = !todo.completed;

  res.json(todo);
});

// DELETE /api/todos/:id - Delete a todo
// INTENTIONAL ISSUE: Missing implementation
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(index, 1);
  res.json({ message: 'Todo deleted' });
});

// INTENTIONAL ISSUE: Missing error handling middleware

module.exports = app;
