// Core data model for the AI-first automation builder.
// All UI features (variable picker, AI patch engine, test/run, readiness)
// read from these shapes — no string parsing of titles anywhere.

export type JsonSchemaPrimitive = "string" | "number" | "boolean";

export type JsonSchema =
  | {
      type: JsonSchemaPrimitive;
      example?: unknown;
      description?: string;
      enum?: readonly (string | number)[];
    }
  | {
      type: "object";
      properties?: Record<string, JsonSchema>;
      example?: unknown;
      description?: string;
    }
  | {
      type: "array";
      items?: JsonSchema;
      example?: unknown;
      description?: string;
    };

export type VariableRef = {
  // Serialized form: {{steps.<stepId>.output.<path...>}}
  stepId: string;
  path: string[];
};

export type InputValue =
  | { kind: "literal"; value: unknown }
  | { kind: "ref"; ref: VariableRef }
  | { kind: "template"; parts: Array<string | VariableRef> };

export type ConditionOperator =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "contains"
  | "exists";

export type Condition = {
  left: InputValue;
  operator: ConditionOperator;
  right: InputValue;
};

// Reserved for Phase 3 (advanced/runtime tab). Defined now so patches against
// FlowStep can target /runtime/* paths without later type churn.
export type RuntimeConfig = {
  retry?: {
    count: number;
    backoff: "fixed" | "exponential";
    delayMs: number;
  };
  timeoutMs?: number;
  onError?: "stop" | "continue" | "branch";
};

export type FlowStepKind = "trigger" | "action" | "condition";

export type FlowStep = {
  id: string;
  kind: FlowStepKind;
  title: string;
  subtitle: string;

  // App / operation identity (drives integrations + step icon)
  app?: string;
  operation?: string;

  // Data contract
  inputSchema: JsonSchema; // typically an object schema
  inputs: Record<string, InputValue>; // current bound values (literal | ref | template)
  outputSchema: JsonSchema;
  sampleOutput: unknown; // realistic mock; powers picker preview & "Test step"

  // Control flow
  branch?: "yes" | "no";
  depth?: number;
  condition?: Condition; // only when kind === "condition"

  // Reserved
  runtime?: RuntimeConfig;
};

export type ExampleWorkflow = {
  id: string;
  label: string;
  prompt: string;
  steps: FlowStep[];
};

export type AppIntegration = {
  id: string;
  name: string;
  icon: string;
};
