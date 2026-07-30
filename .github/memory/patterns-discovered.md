# Patterns Discovered

## Purpose

This file documents recurring code patterns, anti-patterns, and best practices discovered during development. Patterns are added when a solution proves effective across multiple use cases.

**Update Frequency**: When a repeatable pattern emerges (seen 2+ times)  
**Format**: Structured pattern template  
**Committed**: Yes — these are accumulated learnings

---

## Pattern Template

Use this template when documenting a new pattern:

```markdown
## Pattern: [Pattern Name]

**Context**: When/where this pattern applies

**Problem**: The issue this pattern solves

**Solution**: The approach to take

**Example**:
```[language]
// Code example showing the pattern
```

**Related Files**:
- [path/to/file1.js](../../packages/path/to/file1.js)
- [path/to/file2.js](../../packages/path/to/file2.js)

**Notes**: Additional considerations or exceptions
```

---

## Discovered Patterns

### Pattern: Service Initialization - Empty Array vs Null

**Context**: When initializing data structures in service layers or state management

**Problem**: Initializing collections as `null` requires defensive null checks throughout the codebase. Consumers must check `if (data !== null)` before operations like `.map()`, `.filter()`, or `.length`.

**Solution**: Initialize all array/collection fields as empty arrays `[]` rather than `null`. This eliminates null checks and allows immediate use of array methods.

**Example**:
```javascript
// ❌ Anti-pattern: Requires null checks
class TodoService {
  constructor() {
    this.todos = null;  // Bad
  }
  
  getAll() {
    return this.todos || [];  // Need fallback
  }
}

// ✅ Pattern: No null checks needed
class TodoService {
  constructor() {
    this.todos = [];  // Good
  }
  
  getAll() {
    return this.todos;  // Clean, always returns array
  }
}
```

**Related Files**:
- [packages/backend/src/app.js](../../packages/backend/src/app.js) - Service initialization
- [packages/frontend/src/App.js](../../packages/frontend/src/App.js) - React state initialization

**Notes**: 
- Applies to arrays, not objects or primitives
- Exception: When `null` has semantic meaning (e.g., "not yet loaded" vs "loaded but empty")
- Consistent with JavaScript conventions (e.g., `Array.from()` returns `[]` not `null`)

---

## [Add new patterns below]

### Pattern: REST API Input Validation - Fail Fast

**Context**: REST API endpoints that accept user input (POST, PUT, PATCH)

**Problem**: Invalid input can cause server errors or incorrect data. Validation errors should be caught early with clear error messages.

**Solution**: Validate input at the start of handlers. Return 400 (Bad Request) immediately for missing or invalid required fields. Use early returns to avoid nested conditionals.

**Example**:
```javascript
// ✅ Fail fast pattern
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  
  // Validate immediately
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  // Continue with valid data
  const todo = createTodo(title);
  res.status(201).json(todo);
});

// ❌ Anti-pattern: Validation deep in logic
app.post('/api/todos', (req, res) => {
  const todo = { title: req.body.title };
  if (todo.title) {
    // Valid case nested
    const saved = save(todo);
    res.status(201).json(saved);
  } else {
    res.status(400).json({ error: 'Title required' });
  }
});
```

**Related Files**:
- [packages/backend/src/app.js](../../packages/backend/src/app.js) - POST /api/todos validation

**Notes**:
- Use 400 for client errors, 500 for server errors
- Provide specific error messages, not generic "Invalid input"
- Validate data types, required fields, and business rules separately

---

### Pattern: ID Auto-Increment for In-Memory Stores

**Context**: In-memory data stores that need unique IDs (testing, prototypes, simple apps)

**Problem**: Need to generate unique sequential IDs without a database. Collisions break data integrity.

**Solution**: Use a simple counter variable (`nextId`) that increments with each new record. Initialize to 1 and post-increment (`nextId++`) when assigning IDs.

**Example**:
```javascript
// ✅ Simple and reliable
let todos = [];
let nextId = 1;

function createTodo(title) {
  const todo = {
    id: nextId++,  // Assigns current value, then increments
    title,
    completed: false
  };
  todos.push(todo);
  return todo;
}

// ❌ Anti-pattern: Timestamp or random IDs
function createTodo(title) {
  const todo = {
    id: Date.now(),  // Collisions possible with fast creation
    // or
    id: Math.random(),  // Not sequential, harder to debug
    title
  };
  return todo;
}
```

**Related Files**:
- [packages/backend/src/app.js](../../packages/backend/src/app.js) - nextId counter for todos

**Notes**:
- Production apps should use database-generated IDs (auto-increment, UUID)
- For distributed systems, consider UUIDs instead of counters
- Reset `nextId` in tests to ensure predictable IDs

---

### Pattern: Boolean Toggle with Negation Operator

**Context**: Toggling boolean flags (completed/incomplete, on/off, enabled/disabled)

**Problem**: Need to flip a boolean value. Explicit assignments (`value = true` or `value = false`) don't toggle, they set to a fixed state.

**Solution**: Use the logical NOT operator (`!`) to toggle: `value = !value`. This flips `true` to `false` and `false` to `true`.

**Example**:
```javascript
// ✅ Toggle pattern
app.patch('/api/todos/:id/toggle', (req, res) => {
  const todo = findTodo(id);
  todo.completed = !todo.completed;  // Flips current state
  res.json(todo);
});

// ❌ Anti-pattern: Doesn't toggle
app.patch('/api/todos/:id/toggle', (req, res) => {
  const todo = findTodo(id);
  todo.completed = true;  // Always sets to true, never toggles back
  res.json(todo);
});
```

**Related Files**:
- [packages/backend/src/app.js](../../packages/backend/src/app.js) - PATCH /api/todos/:id/toggle

**Notes**:
- Use for binary states only, not multi-state enums
- Alternative: `value = value ? false : true` (more verbose, same effect)
- For complex state transitions, use explicit state machines

---

### Pattern: 404 Not Found with findIndex Check

**Context**: REST endpoints that operate on specific resources (PUT, PATCH, DELETE by ID)

**Problem**: Need to distinguish between "resource not found" (404) and successful operations (200). Direct array mutations without checks can silently fail.

**Solution**: For deletions, use `findIndex()` and check for `-1`. For updates, use `find()` and check for `undefined`. Return 404 with clear error message before attempting mutation.

**Example**:
```javascript
// ✅ DELETE with findIndex
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(index, 1);
  res.json({ message: 'Todo deleted' });
});

// ✅ UPDATE with find
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todo.title = req.body.title;
  res.json(todo);
});

// ❌ Anti-pattern: No 404 handling
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter((t) => t.id !== id);  // Silently does nothing if not found
  res.json({ message: 'Deleted' });  // Lies to client
});
```

**Related Files**:
- [packages/backend/src/app.js](../../packages/backend/src/app.js) - DELETE, PUT, PATCH endpoints

**Notes**:
- Use `findIndex()` for deletions (`splice()` needs index)
- Use `find()` for updates (returns object reference)
- Parse string IDs to numbers before comparison: `parseInt(req.params.id)`
- Always return consistent error format: `{ error: 'message' }`

---

<!-- New pattern entries go here -->
