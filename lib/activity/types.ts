// Activity feed data model.
//
// The backend returns a version-bucketed changelog (see `RawVersion`). The UI
// needs a user-grouped, human-readable feed (see the design). Friendly step
// names and the true step "kind" are NOT in the raw payload — `step_type` is
// always "action" for switches, conditions and code steps alike — so we join
// against a `StepRegistry` (keyed by step_id) to resolve them.

/** Raw operation verbs the backend emits. */
export type RawOperation =
  | "create"
  | "update"
  | "delete"
  | "move"
  | "reorder"
  | "change"
  | "publish"
  | "pause"
  | "resume";

/** Raw step_type buckets the backend emits. */
export type RawStepType =
  | "flow"
  | "trigger"
  | "pre_process"
  | "precondition"
  | "loop"
  | "response"
  | "action";

export interface RawOperationEntry {
  operation: RawOperation;
  step_type: RawStepType;
  step_name: string | null;
  step_id: string | null;
  /** ISO-8601 UTC timestamp. */
  time: string;
}

export interface RawVersion {
  user_id: string;
  version: number;
  operations: RawOperationEntry[];
}

export type RawActivityResponse = RawVersion[];

// ---------- Registries (the "separate join source") ----------

/**
 * Resolved kind of a step. Drives the noun shown in a sentence and lets us
 * distinguish a Multipath (switch) from a plain Step, which `step_type` cannot.
 */
export type StepKind =
  | "flow"
  | "trigger"
  | "pre_process"
  | "precondition" // "Break Flow" in the UI
  | "loop"
  | "response"
  | "multipath" // switch (swtc…)
  | "condition" // a path/branch inside a multipath (ifcb…)
  | "step"; // code / integration action (func…)

export interface StepMeta {
  /** User-facing label, e.g. "Send Slack Message". */
  displayName: string;
  kind: StepKind;
}

/** step_id → friendly metadata. */
export type StepRegistry = Record<string, StepMeta>;

export interface UserMeta {
  name: string;
  /** Optional 1–2 char initials override; derived from name otherwise. */
  initials?: string;
}

/** user_id → profile. */
export type UserRegistry = Record<string, UserMeta>;

// ---------- Derived feed model (what the UI renders) ----------

/** Coarse bucket used by the panel's filter chips. */
export type ActivityCategory = "step" | "structure" | "publish";

export interface ActivityChange {
  id: string;
  /** Original operation + resolved kind, so the UI can pick icon + color. */
  operation: RawOperation;
  kind: StepKind;
  /** Filter bucket: named step vs structural part vs flow publish. */
  category: ActivityCategory;
  /** Pre-rendered sentence, e.g. "Added Step Log to Sheet". */
  text: string;
  /**
   * Segments so the UI can bold the name/emphasis without string parsing.
   * `emphasis: true` renders bold (the step/detail name).
   */
  segments: { text: string; emphasis?: boolean }[];
  /** Local "HH:MM". */
  time: string;
  /** Original ISO timestamp (for sorting / tooltips). */
  isoTime: string;
}

export interface ActivityUserGroup {
  userId: string;
  userName: string;
  initials: string;
  changeCount: number;
  changes: ActivityChange[];
}

export interface ActivityDateSection {
  /** "Today" | "Yesterday" | "12 Aug 2026". */
  label: string;
  groups: ActivityUserGroup[];
}

export type ActivityFeed = ActivityDateSection[];
