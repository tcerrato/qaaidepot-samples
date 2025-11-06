# AI Automation Results Triage

An AI agent that analyzes and triages automation test results, categorizing failures, identifying patterns, and prioritizing issues.

## Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_key_here
   ```

3. Install dependencies (from root):
   ```bash
   pnpm install
   ```

## Running

From the root directory:
```bash
pnpm --filter @qaai-demos/ai-automation-results-triage start
```

Or from this directory:
```bash
pnpm start
```

For development with hot reload:
```bash
pnpm dev
```

## Project Structure

```
src/
  ├── index.ts          # Main entry point
  ├── agent.ts          # LangGraph agent definition
  ├── types.ts          # TypeScript types
  └── triage.ts         # Triage logic and analysis
```

## Features

- Analyze test execution results
- Categorize failures by type (flaky, environment, code bug, etc.)
- Identify patterns and trends
- Prioritize issues based on impact
- Generate triage reports

