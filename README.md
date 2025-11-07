# QAAI LangGraph Demos

A monorepo containing multiple standalone AI demos - some using LangGraph agents, others simple AI scripts.

## Structure

```
qaai-langgraph-demos/
├── shared/              # Shared utilities and helpers
└── demos/               # Individual demo projects
    ├── lang-graph-agent-test-case-creator/
    ├── ai-automation-results-triage/
    ├── test-app/        # React test application for AI demos to test
    └── self-healing-playwright/  # Self-healing test automation demo
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

Install dependencies for all workspaces:

```bash
pnpm install
```

### Running a Demo

Each demo is a standalone project. To run a specific demo:

```bash
# From root
pnpm --filter @qaai-demos/lang-graph-agent-test-case-creator start

# Or navigate to the demo directory
cd demos/lang-graph-agent-test-case-creator
pnpm start
```

### Adding a New Demo

1. Create a new directory under `demos/`
2. Add a `package.json` with a name like `@qaai-demos/your-demo-name`
3. Set up your demo structure (src/, README.md, .env.example)
4. The workspace will automatically pick it up

## Available Scripts

- `pnpm build` - Build all projects
- `pnpm lint` - Lint all projects
- `pnpm format` - Format all code with Prettier
- `pnpm clean` - Clean all build artifacts

## Demos

### lang-graph-agent-test-case-creator

A LangGraph agent that generates test cases based on requirements or code.

See [demos/lang-graph-agent-test-case-creator/README.md](./demos/lang-graph-agent-test-case-creator/README.md) for details.

### ai-automation-results-triage

An AI agent that analyzes and triages automation test results, categorizing failures, identifying patterns, and prioritizing issues.

See [demos/ai-automation-results-triage/README.md](./demos/ai-automation-results-triage/README.md) for details.

### test-app

A React + Vite test application with various UI scenarios designed to be tested by AI agents. Includes login, CRUD operations, complex forms, file uploads, dialogs, iframes, and error handling.

See [demos/test-app/README.md](./demos/test-app/README.md) for details.

### self-healing-playwright

A demonstration of Tier 1 self-healing test automation using Playwright. Features selector catalog with fallbacks, automatic healing on selector failures, and human-approved catalog updates.

See [demos/self-healing-playwright/README.md](./demos/self-healing-playwright/README.md) for details.

