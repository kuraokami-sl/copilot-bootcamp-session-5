---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute Step from GitHub Issue

You are executing a step from the exercise GitHub Issue. Follow the instructions systematically using TDD principles.

## Instructions

### 1. Get the Exercise Issue

**If issue number provided by user**: Use that issue number directly.

**If no issue number provided**: Use gh CLI to find the exercise issue:
```bash
gh issue list --state open
```

Look for an issue with `Exercise:` in the title. This is the main exercise issue.

### 2. Retrieve Issue Content with Comments

Get the full issue including all step comments:
```bash
gh issue view <issue-number> --comments
```

**Important**: The exercise is structured with:
- Main issue body (overview)
- Steps posted as **comments** on the issue
- Each step comment has a header like `# Step 5-0:` or `# Step 5-1:`

### 3. Parse the Latest/Current Step

From the issue comments, identify the **current step** you should be working on:
- Look for step numbers in comments (e.g., `# Step 5-0:`, `# Step 5-1:`)
- The latest uncommented step is typically the current one
- Extract the entire step content including:
  - Step description/context
  - `:keyboard: Activity:` sections (these are the tasks to execute)
  - Success criteria (for later validation)

### 4. Execute Activities Systematically

For each `:keyboard: Activity:` section in the step:

**Use TDD Approach** (this is critical):
1. 🔴 **RED**: Write tests FIRST that describe the expected behavior
2. Run tests to verify they fail for the right reason
3. 🟢 **GREEN**: Implement minimal code to make tests pass
4. Run tests to verify they pass
5. 🔵 **REFACTOR**: Improve code while keeping tests green

**Testing Scope Constraints** (from project instructions):
- ✅ Use Jest for backend API tests
- ✅ Use React Testing Library for frontend component tests
- ✅ Recommend manual browser testing for full UI flows
- ❌ **NEVER suggest** Playwright, Cypress, Selenium, or any e2e framework
- ❌ **NEVER suggest** browser automation tools

**Track Progress**:
- Use the todo tool to break down activities into trackable tasks
- Mark tasks as in-progress when starting
- Mark completed immediately after finishing
- Update working notes in [.github/memory/scratch/working-notes.md](../memory/scratch/working-notes.md)

### 5. Memory Integration

Document your work in the memory system:

**During execution** ([.github/memory/scratch/working-notes.md](../memory/scratch/working-notes.md)):
- Note which step you're executing
- Track each activity's progress
- Document decisions made
- Record any blockers

**Pattern recognition** ([.github/memory/patterns-discovered.md](../memory/patterns-discovered.md)):
- If you discover a repeatable pattern, note it for documentation

### 6. DO NOT Commit or Push

**CRITICAL**: This prompt ONLY executes the step activities. It does NOT:
- Stage changes (`git add`)
- Commit changes (`git commit`)
- Push changes (`git push`)

That's the job of the `/commit-and-push` prompt.

### 7. Completion

After completing all activities:
1. Run all tests to verify everything passes
2. Run linting to check for any errors (note them, but don't fix unless they break tests)
3. Inform the user:
   ```
   ✅ Step activities completed!
   
   Next steps:
   1. Review the changes made
   2. Run `/validate-step <step-number>` to check success criteria
   3. If validation passes, run `/commit-and-push <branch-name>` to commit and push changes
   ```

## Example Workflow

**User invokes**: `/execute-step`

**You respond**:
```
Finding exercise issue...

Found: Issue #12 "Exercise: Build TODO App with TDD"

Latest step: Step 5-0: Implement GET /api/todos endpoint

Activities to execute:
1. Write failing tests for GET /api/todos
2. Implement the endpoint
3. Verify tests pass

Starting execution using TDD approach...

🔴 RED: Writing test first...
[Creates test file]
[Runs test - shows failure]

🟢 GREEN: Implementing endpoint...
[Implements code]
[Runs test - shows success]

🔵 REFACTOR: Code is clean, tests green ✅

✅ Step activities completed!

Next steps:
1. Review the changes made
2. Run `/validate-step 5-0` to check success criteria
3. If validation passes, run `/commit-and-push feature/step-5-0` to commit and push
```

## Reference Documentation

This prompt relies on knowledge from:
- **Workflow Utilities** section in [.github/copilot-instructions.md](../copilot-instructions.md) for gh CLI commands
- **Testing Scope** section in [.github/copilot-instructions.md](../copilot-instructions.md) for testing constraints
- **TDD Workflow** principles from tdd-developer agent guidelines

## User Input

**issue-number** (optional): If not provided, automatically find the exercise issue using `gh issue list`

Example invocations:
- `/execute-step` - Finds exercise issue automatically
- `/execute-step 12` - Uses issue #12
