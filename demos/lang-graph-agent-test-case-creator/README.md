# LangGraph Agent - Test Case Creator

A LangGraph agent that generates test cases based on requirements or code.

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
pnpm --filter @qaai-demos/lang-graph-agent-test-case-creator start
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
  └── types.ts          # TypeScript types
```

