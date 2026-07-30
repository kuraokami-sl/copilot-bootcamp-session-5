---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

# Commit and Push Changes

Analyze workspace changes, generate a conventional commit message, and push to a feature branch.

## Instructions

### 1. Get Branch Name from User

**CRITICAL**: This prompt requires a branch name as input.

**If user did NOT provide a branch name**:
- Ask the user: "What branch name should I use? (e.g., `feature/step-5-0`, `fix/validation-error`)"
- Wait for user response
- Use the provided branch name

**If user provided a branch name**: Use it directly.

### 2. Analyze Changes

Check what files have been modified:
```bash
git status
```

Get detailed changes:
```bash
git diff
```

**Analyze the changes** to understand:
- What files were modified
- What functionality was added/changed/fixed
- Scope of the changes (backend, frontend, both)

### 3. Generate Conventional Commit Message

Based on the Git Workflow section in [.github/copilot-instructions.md](../copilot-instructions.md), use conventional commit format:

**Format**: `<type>: <description>`

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring without changing behavior
- `chore:` - Maintenance tasks (dependencies, config)
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)

**Examples**:
- `feat: implement GET /api/todos endpoint with tests`
- `fix: validate todo ID in DELETE endpoint`
- `test: add integration tests for todo creation`
- `refactor: extract todo validation into separate function`
- `chore: resolve ESLint errors in backend`

**Generate a clear, descriptive commit message** that summarizes the changes.

### 4. Create or Switch to Branch

**If branch doesn't exist**, create it:
```bash
git checkout -b <branch-name>
```

**If branch exists**, switch to it:
```bash
git checkout <branch-name>
```

**NEVER commit to main** or any other branch. Only use the user-provided branch name.

### 5. Stage All Changes

Stage all modified files:
```bash
git add .
```

Confirm what's staged:
```bash
git status
```

### 6. Commit with Generated Message

Commit with the conventional commit message:
```bash
git commit -m "<generated-message>"
```

### 7. Push to Remote Branch

Push to the specified branch:
```bash
git push origin <branch-name>
```

**If this is the first push** (new branch), use:
```bash
git push --set-upstream origin <branch-name>
```

### 8. Completion Summary

Inform the user:
```
✅ Changes committed and pushed!

Branch: <branch-name>
Commit: <commit-message>

Files changed:
- <list of files>

Next steps:
- Continue with `/execute-step` for next step
- Or create a Pull Request when ready: `gh pr create`
```

## Example Workflow

**User invokes**: `/commit-and-push feature/step-5-0`

**You respond**:
```
Analyzing changes...

Modified files:
- packages/backend/src/app.js
- packages/backend/__tests__/app.test.js

Changes summary:
- Added GET /api/todos endpoint
- Added tests for GET /api/todos

Generating commit message...
Commit message: feat: implement GET /api/todos endpoint with tests

Creating branch feature/step-5-0...
Staging changes...
Committing...
Pushing to remote...

✅ Changes committed and pushed!

Branch: feature/step-5-0
Commit: feat: implement GET /api/todos endpoint with tests

Files changed:
- packages/backend/src/app.js
- packages/backend/__tests__/app.test.js

Next steps:
- Continue with `/execute-step` for next step
- Or create a Pull Request when ready: `gh pr create`
```

## Reference Documentation

This prompt relies on knowledge from:
- **Git Workflow** section in [.github/copilot-instructions.md](../copilot-instructions.md) for conventional commits and branch strategy

## User Input

**branch-name** (REQUIRED): The feature branch name to commit and push to

Example invocations:
- `/commit-and-push feature/step-5-0`
- `/commit-and-push fix/validation-bug`
- `/commit-and-push` - Will ask for branch name

## Safety Notes

- ✅ Only commits to the user-specified branch
- ✅ Never commits directly to main
- ✅ Creates branch if it doesn't exist
- ✅ Shows full change summary before committing
- ✅ Uses conventional commit format for clarity
