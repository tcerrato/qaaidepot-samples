// Type definitions for the test case creator agent

export interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: string[];
  expectedResult: string;
  priority: "low" | "medium" | "high";
}

export interface AgentState {
  input: string;
  testCases: TestCase[];
  currentStep: string;
}

