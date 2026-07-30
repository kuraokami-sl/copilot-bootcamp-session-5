# Development Memory System

## Purpose

This memory system tracks patterns, decisions, and lessons learned during development. It helps AI assistants (and human developers) build on past discoveries rather than rediscovering the same insights repeatedly.

## Memory Types

### Persistent Memory (Committed to Git)

**Location**: `.github/copilot-instructions.md`  
**Purpose**: Foundational principles, workflows, and testing standards  
**When to Update**: Rarely — only when team standards change

**Location**: `.github/memory/session-notes.md`  
**Purpose**: Historical summaries of completed development sessions  
**When to Update**: At the end of each significant development session  
**Content**: What was accomplished, key findings, decisions made, outcomes

**Location**: `.github/memory/patterns-discovered.md`  
**Purpose**: Accumulated code patterns, anti-patterns, and best practices discovered over time  
**When to Update**: When you discover a repeatable pattern or solve a recurring problem  
**Content**: Pattern templates with context, problem, solution, examples, and related files

### Working Memory (NOT Committed to Git)

**Location**: `.github/memory/scratch/working-notes.md`  
**Purpose**: Active session notes, temporary findings, current blockers  
**When to Update**: Continuously during active development  
**Content**: Current task, approach, findings, decisions, blockers, next steps  
**Lifecycle**: Created at session start, used during work, summarized into `session-notes.md` at session end, then can be cleared for next session

## Directory Structure

```
.github/
├── copilot-instructions.md       # Persistent: Foundational principles (committed)
└── memory/
    ├── README.md                  # This file: Memory system guide (committed)
    ├── session-notes.md           # Persistent: Historical session summaries (committed)
    ├── patterns-discovered.md     # Persistent: Accumulated patterns (committed)
    └── scratch/
        ├── .gitignore             # Ignores all files in scratch/ (committed)
        └── working-notes.md       # Working: Active session notes (NOT committed)
```

## When to Use Each File

### During TDD Workflow (Red-Green-Refactor)

1. **Start of Session**: Open `scratch/working-notes.md` and note your current task
2. **Red Phase**: Note which test is failing and why
3. **Green Phase**: Document your implementation approach
4. **Refactor Phase**: If you discover a pattern, note it for later addition to `patterns-discovered.md`
5. **End of Session**: Summarize key learnings into `session-notes.md`

### During Linting/Code Quality Work

1. **Active Work**: Track error categories and fixes in `scratch/working-notes.md`
2. **Pattern Emerges**: If a lint error reveals a broader pattern (e.g., "always validate input before processing"), add to `patterns-discovered.md`
3. **End of Session**: Summarize the cleanup work in `session-notes.md`

### During Debugging Workflow

1. **Problem Discovery**: Note the issue and symptoms in `scratch/working-notes.md`
2. **Investigation**: Track debugging steps, hypotheses, and findings
3. **Root Cause**: Document the root cause and solution approach
4. **Pattern Recognition**: If this reveals a recurring issue, document it in `patterns-discovered.md`
5. **End of Session**: Add a brief summary to `session-notes.md`

### During Feature Implementation

1. **Planning**: Break down the feature in `scratch/working-notes.md`
2. **Implementation**: Track progress, decisions, and blockers
3. **Testing**: Note test results and any issues discovered
4. **Pattern Discovery**: If you establish a new convention (e.g., "all service methods return {success, data, error}"), add to `patterns-discovered.md`
5. **End of Session**: Summarize completed work in `session-notes.md`

## How AI Reads and Applies These Patterns

### Context Loading

When you interact with AI assistants like GitHub Copilot:

1. **Automatic Context**: AI reads `.github/copilot-instructions.md` for foundational guidelines
2. **On Request**: AI can read `session-notes.md` and `patterns-discovered.md` for project-specific context
3. **Active Session**: You can reference `scratch/working-notes.md` to give AI your current context

### Pattern Application

AI uses these memories to:

- **Suggest consistent solutions**: Apply patterns from `patterns-discovered.md` to new code
- **Avoid past mistakes**: Reference lessons learned in `session-notes.md`
- **Continue previous work**: Pick up where you left off using session summaries
- **Make contextual decisions**: Understand project-specific conventions and trade-offs

### Example AI Workflow

```
You: "Implement a new service for managing comments"

AI (reading patterns-discovered.md):
- Sees pattern: "Service initialization - always initialize arrays to []"
- Sees pattern: "Service methods return {success, data, error} format"
- Applies both patterns to new implementation

You: "Why did you initialize comments as []?"

AI: "Based on the pattern documented in patterns-discovered.md, we initialize
arrays to empty arrays rather than null to avoid null checks in consumers."
```

## Best Practices

### For `scratch/working-notes.md`

- ✅ Update frequently during active work
- ✅ Use as a scratchpad for thoughts and findings
- ✅ Don't worry about formatting or completeness
- ✅ Clear after summarizing into `session-notes.md`
- ❌ Don't commit to git (it's ignored)

### For `session-notes.md`

- ✅ Add entries at the end of significant sessions
- ✅ Keep summaries concise (3-5 bullet points)
- ✅ Focus on outcomes and key decisions
- ✅ Commit to git for historical reference
- ❌ Don't include granular implementation details

### For `patterns-discovered.md`

- ✅ Document patterns only after seeing them 2+ times
- ✅ Include concrete examples with code snippets
- ✅ Reference specific files where pattern is used
- ✅ Update when patterns evolve or exceptions emerge
- ❌ Don't document one-off solutions as patterns

## Workflow Summary

```
Session Start
    ↓
Create/Update scratch/working-notes.md
    ↓
[Active Development - continuous notes]
    ↓
Pattern Discovered? → Add to patterns-discovered.md
    ↓
Session End
    ↓
Summarize into session-notes.md
    ↓
Clear scratch/working-notes.md (optional)
    ↓
Commit session-notes.md and patterns-discovered.md
```

## Difference: session-notes.md vs scratch/working-notes.md

| Aspect | session-notes.md | scratch/working-notes.md |
|--------|------------------|--------------------------|
| **Purpose** | Historical record | Active workspace |
| **Committed** | Yes | No (gitignored) |
| **Content** | Completed session summaries | Current task, work-in-progress notes |
| **Audience** | Future you, team, AI | Current you, AI during session |
| **Format** | Polished summaries | Scratchpad, rough notes |
| **Lifecycle** | Accumulates over time | Created per session, cleared after |
| **Update Frequency** | Once per session (end) | Continuously during session |

Think of `session-notes.md` as your project's development diary (kept forever), and `scratch/working-notes.md` as your whiteboard (erased after each session).

## Getting Started

1. At the start of your session, open `scratch/working-notes.md` and fill in "Current Task"
2. As you work, jot down findings, decisions, and blockers
3. When you discover a repeatable pattern, note it to add later to `patterns-discovered.md`
4. At session end, copy key insights into `session-notes.md`
5. Commit `session-notes.md` and `patterns-discovered.md`
6. Clear or leave `scratch/working-notes.md` — it won't be committed

Happy coding! 🚀
