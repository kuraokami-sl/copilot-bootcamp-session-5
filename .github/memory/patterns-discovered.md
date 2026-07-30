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

<!-- New pattern entries go here -->
