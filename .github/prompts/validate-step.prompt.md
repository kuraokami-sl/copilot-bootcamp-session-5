---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate Step Success Criteria

Check that all success criteria for a specific step are met. This uses the code-reviewer agent to systematically verify completion.

## Instructions

### 1. Get Step Number from User

**CRITICAL**: This prompt requires a step number as input.

**Format**: `<major>-<minor>` (e.g., `5-0`, `5-1`, `6-0`)

**If user did NOT provide a step number**:
- Ask the user: "What step number should I validate? (e.g., `5-0`, `5-1`)"
- Wait for user response
- Use the provided step number

**If user provided a step number**: Use it directly (e.g., from `/validate-step 5-0`).

### 2. Find the Exercise Issue

Use gh CLI to find the main exercise issue (from Workflow Utilities in [.github/copilot-instructions.md](../copilot-instructions.md)):
```bash
gh issue list --state open
```

Look for an issue with `Exercise:` in the title. Get the issue number.

### 3. Retrieve Issue with Comments

Get the full issue including all step comments:
```bash
gh issue view <issue-number> --comments
```

**Important**: Steps are posted as comments on the issue, not in the main body.

### 4. Find the Specific Step

Search through the issue comments to find the step matching the user's step number.

**Look for**: `# Step <step-number>:` (e.g., `# Step 5-0:`, `# Step 5-1:`)

**Extract the full step content**, including:
- Step description
- Activities section
- **Success Criteria section** (this is what you'll validate)

### 5. Extract Success Criteria

From the step comment, find the section labeled:
- `Success Criteria` or
- `## Success Criteria` or
- `:white_check_mark: Success Criteria`

**Extract all criteria** listed under this section. They're typically formatted as:
- Bullet points
- Checkboxes
- Numbered lists

### 6. Validate Each Criterion

For each success criterion, **systematically check** against the workspace:

**Common criteria types**:

**Tests passing**:
```bash
npm test
```
Check if all tests pass and count matches expectation.

**Files exist**:
```bash
ls -la <file-path>
```
Verify specified files were created.

**Endpoints respond correctly**:
- Check implementation in code
- Verify tests cover the endpoint
- Optionally test manually if server is running

**Code quality (no lint errors)**:
```bash
npm run lint
```
Check for ESLint errors.

**Specific functionality implemented**:
- Read the relevant files
- Verify the logic/feature exists
- Check tests validate the functionality

**HTTP status codes**:
- Review endpoint implementations
- Check test assertions for status codes

**Response structures**:
- Examine endpoint return values
- Verify test assertions match expected structure

### 7. Report Results

Provide a **clear, structured report** to the user:

```markdown
## Step <step-number> Validation Results

### Success Criteria Status

✅ Criterion 1: [Description] - PASS
   - Evidence: [What you found that confirms this]

✅ Criterion 2: [Description] - PASS
   - Evidence: [What you found]

❌ Criterion 3: [Description] - FAIL
   - Issue: [What's missing or wrong]
   - Action needed: [Specific steps to fix]

⚠️ Criterion 4: [Description] - PARTIAL
   - What's working: [Partial completion details]
   - What's missing: [What still needs to be done]

### Overall Status

[✅ ALL CRITERIA MET - Step complete!]
or
[❌ INCOMPLETE - X criteria need attention]

### Next Steps

[If all pass]:
- Run `/commit-and-push <branch-name>` to commit and push your changes
- Continue to next step with `/execute-step`

[If some fail]:
- Address the incomplete criteria listed above
- Re-run `/validate-step <step-number>` after fixes
```

### 8. Provide Specific Guidance

For any **failed criteria**, provide:
- **Clear explanation** of what's missing
- **Specific actions** to fix (don't just say "fix it")
- **File locations** where changes are needed
- **Code examples** if helpful

**Example**:
```
❌ All tests passing (12 expected)

Issue: Only 10/12 tests passing. 2 tests failing in app.test.js:
- "should return 404 for non-existent todo"
- "should validate todo ID is a number"

Action needed:
1. Open packages/backend/__tests__/app.test.js
2. Run `npm test` to see detailed failure messages
3. Fix the DELETE endpoint validation logic in packages/backend/src/app.js
4. Ensure ID validation returns 400 for invalid IDs
5. Re-run tests to verify fix
```

## Example Workflow

**User invokes**: `/validate-step 5-0`

**You respond**:
```
Finding exercise issue...
Found: Issue #12 "Exercise: Build TODO App with TDD"

Locating Step 5-0 in issue comments...
Found: Step 5-0: Implement GET /api/todos endpoint

Extracting success criteria...

Success Criteria:
1. GET /api/todos endpoint implemented
2. Endpoint returns 200 status
3. Endpoint returns array of todos
4. Tests written and passing
5. No ESLint errors

Validating each criterion...

Running tests...
Running lint...
Checking implementation...

## Step 5-0 Validation Results

### Success Criteria Status

✅ GET /api/todos endpoint implemented - PASS
   - Found endpoint in packages/backend/src/app.js at line 45

✅ Endpoint returns 200 status - PASS
   - Test assertion confirms: expect(response.status).toBe(200)

✅ Endpoint returns array of todos - PASS
   - Test confirms response.body is an array
   - Initial state returns empty array []

✅ Tests written and passing - PASS
   - All tests passing: 12/12 ✅
   - New tests added: 3 tests for GET /api/todos

❌ No ESLint errors - FAIL
   - Found 2 ESLint errors in app.js:
     * Line 47: 'todos' is assigned but never used (no-unused-vars)
     * Line 52: Unexpected console.log statement (no-console)
   
   Action needed:
   1. Remove unused 'todos' variable or use it
   2. Remove console.log statement (debug leftover)
   3. Run `npm run lint` to verify fixes

### Overall Status

❌ INCOMPLETE - 1 criterion needs attention

### Next Steps

- Fix the 2 ESLint errors listed above
- Re-run `/validate-step 5-0` to confirm all criteria pass
- Then run `/commit-and-push feature/step-5-0`
```

## Reference Documentation

This prompt relies on knowledge from:
- **Workflow Utilities** section in [.github/copilot-instructions.md](../copilot-instructions.md) for gh CLI commands
- **Code reviewer** agent guidelines for systematic validation approach

## User Input

**step-number** (REQUIRED): The step to validate in format `<major>-<minor>`

Example invocations:
- `/validate-step 5-0`
- `/validate-step 5-1`
- `/validate-step` - Will ask for step number

## Validation Principles

- ✅ Systematic checking of each criterion
- ✅ Evidence-based reporting (show what you found)
- ✅ Specific, actionable guidance for failures
- ✅ Clear overall status (pass/fail)
- ✅ Next steps always provided
