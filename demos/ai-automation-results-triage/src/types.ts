// Type definitions for the automation results triage agent

export interface TestResult {
  id: string;
  name: string;
  status: "passed" | "failed" | "skipped" | "flaky";
  duration: number;
  error?: string;
  stackTrace?: string;
  timestamp: string;
  environment?: string;
  browser?: string;
  os?: string;
}

export interface TriageCategory {
  type: "flaky" | "environment" | "code_bug" | "data_issue" | "timeout" | "unknown";
  confidence: number;
  reasoning: string;
}

export interface TriageResult {
  testResult: TestResult;
  category: TriageCategory;
  priority: "low" | "medium" | "high" | "critical";
  similarFailures?: string[]; // IDs of similar failing tests
  recommendedAction?: string;
}

export interface AgentState {
  testResults: TestResult[];
  triageResults: TriageResult[];
  patterns: string[];
  currentStep: string;
}

