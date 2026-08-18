// Transform the raw version-bucketed changelog into the user-grouped,
// human-readable feed shown in the Activity panel design.
//
// Pipeline: flatten → dedup → resolve (registry join) → sentence → sort desc →
// group into contiguous same-user runs → bucket by local date.

import type {
  ActivityCategory,
  ActivityChange,
  ActivityDateSection,
  ActivityFeed,
  ActivityUserGroup,
  RawActivityResponse,
  RawOperation,
  RawOperationEntry,
  StepKind,
  StepMeta,
  StepRegistry,
  UserRegistry,
} from "./types";

export interface TransformOptions {
  stepRegistry?: StepRegistry;
  userRegistry?: UserRegistry;
  /**
   * Hide flow-level lifecycle noise (publish / pause / resume of the whole
   * flow). Defaults to true — these clutter the change feed.
   */
  hideFlowLifecycle?: boolean;
  /** Reference "now" for Today/Yesterday labels. Defaults to new Date(). */
  now?: Date;
  /** Locale for date/time formatting. */
  locale?: string;
}

/** A flattened entry that remembers which user authored it. */
interface FlatEntry extends RawOperationEntry {
  userId: string;
}

const VERB: Record<RawOperation, string> = {
  create: "Added",
  update: "Updated",
  delete: "Removed",
  move: "Moved",
  reorder: "Moved",
  change: "Changed",
  publish: "Published",
  pause: "Paused",
  resume: "Resumed",
};

/**
 * Kinds that carry a real user-facing name worth showing. Singleton flow parts
 * (loop, precondition/"Break Flow", response, pre-process, trigger, flow) are
 * identified by the noun alone — their internal step_name is not shown.
 */
const NAMED_KINDS: ReadonlySet<StepKind> = new Set([
  "step",
  "multipath",
  "condition",
]);

/** Noun shown for each resolved kind. */
const NOUN: Record<StepKind, string> = {
  flow: "Flow",
  trigger: "Trigger",
  pre_process: "Pre-process",
  precondition: "Break Flow",
  loop: "Loop",
  response: "Response",
  multipath: "Multipath",
  condition: "Condition",
  step: "Step",
};

/**
 * Best-effort kind when the registry has no entry for a step_id. Uses the
 * step_id prefix convention (swtc = switch/multipath, ifcb = condition,
 * func = code step) and finally falls back to step_type.
 */
function inferKind(entry: FlatEntry): StepKind {
  const id = entry.step_id ?? "";
  if (id.startsWith("swtc")) return "multipath";
  if (id.startsWith("ifcb")) return "condition";
  if (id.startsWith("func")) return "step";
  switch (entry.step_type) {
    case "flow":
      return "flow";
    case "trigger":
      return "trigger";
    case "pre_process":
      return "pre_process";
    case "precondition":
      return "precondition";
    case "loop":
      return "loop";
    case "response":
      return "response";
    default:
      return "step";
  }
}

function resolveMeta(entry: FlatEntry, registry: StepRegistry): StepMeta {
  if (entry.step_id && registry[entry.step_id]) return registry[entry.step_id];
  return { displayName: entry.step_name ?? "", kind: inferKind(entry) };
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Build the emphasized segments and flat text for one entry. */
function buildSentence(
  entry: FlatEntry,
  meta: StepMeta,
): { segments: ActivityChange["segments"]; text: string } {
  const verb = VERB[entry.operation] ?? entry.operation;
  const noun = NOUN[meta.kind];
  const name = meta.displayName?.trim();

  const segments: ActivityChange["segments"] = [];

  // Only named steps show their label; singleton flow parts use the noun alone
  // ("Removed Break Flow", "Added Loop", "Updated Response").
  if (name && NAMED_KINDS.has(meta.kind)) {
    segments.push({ text: `${verb} ${noun} ` });
    segments.push({ text: name, emphasis: true });
  } else {
    segments.push({ text: `${verb} ${noun}` });
  }

  return { segments, text: segments.map((s) => s.text).join("") };
}

function fmtTime(iso: string, locale?: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

function sameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dateLabel(iso: string, now: Date, locale?: string): string {
  const d = new Date(iso);
  if (sameLocalDay(d, now)) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameLocalDay(d, yesterday)) return "Yesterday";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * True for whole-flow lifecycle noise we drop (create / move / pause / resume
 * of the flow itself). Publishes are kept — they're a first-class filter.
 */
function isFlowLifecycle(entry: FlatEntry): boolean {
  return (
    entry.step_type === "flow" &&
    (entry.operation === "pause" ||
      entry.operation === "resume" ||
      entry.operation === "create" ||
      entry.operation === "move")
  );
}

const STEP_KINDS: ReadonlySet<StepKind> = new Set([
  "step",
  "multipath",
  "condition",
]);

function categorize(operation: RawOperation, kind: StepKind): ActivityCategory {
  if (operation === "publish") return "publish";
  return STEP_KINDS.has(kind) ? "step" : "structure";
}

export function transformActivity(
  raw: RawActivityResponse,
  options: TransformOptions = {},
): ActivityFeed {
  const {
    stepRegistry = {},
    userRegistry = {},
    hideFlowLifecycle = true,
    now = new Date(),
    locale,
  } = options;

  // 1. Flatten, remembering author.
  const flat: FlatEntry[] = [];
  for (const version of raw) {
    for (const op of version.operations) {
      flat.push({ ...op, userId: version.user_id });
    }
  }

  // 2. Optionally drop flow-lifecycle noise.
  const filtered = hideFlowLifecycle
    ? flat.filter((e) => !isFlowLifecycle(e))
    : flat;

  // 3. Sort newest first.
  filtered.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));

  // 4. Dedup consecutive identical rows (same op/step/time).
  const deduped: FlatEntry[] = [];
  for (const e of filtered) {
    const prev = deduped[deduped.length - 1];
    if (
      prev &&
      prev.operation === e.operation &&
      prev.step_id === e.step_id &&
      prev.step_type === e.step_type &&
      prev.time === e.time &&
      prev.userId === e.userId
    ) {
      continue;
    }
    deduped.push(e);
  }

  // 5. Group into contiguous same-user runs, then bucket by local date.
  const sections: ActivityDateSection[] = [];
  let currentSection: ActivityDateSection | null = null;
  let currentGroup: ActivityUserGroup | null = null;

  for (const e of deduped) {
    const label = dateLabel(e.time, now, locale);
    if (!currentSection || currentSection.label !== label) {
      currentSection = { label, groups: [] };
      sections.push(currentSection);
      currentGroup = null;
    }

    if (!currentGroup || currentGroup.userId !== e.userId) {
      const userName = userRegistry[e.userId]?.name ?? `User ${e.userId}`;
      const initials =
        userRegistry[e.userId]?.initials ?? initialsFor(userName);
      currentGroup = {
        userId: e.userId,
        userName,
        initials,
        changeCount: 0,
        changes: [],
      };
      currentSection.groups.push(currentGroup);
    }

    const meta = resolveMeta(e, stepRegistry);
    const { segments, text } = buildSentence(e, meta);
    currentGroup.changes.push({
      id: `${e.step_id ?? e.step_type}-${e.time}-${e.operation}`,
      operation: e.operation,
      kind: meta.kind,
      category: categorize(e.operation, meta.kind),
      text,
      segments,
      time: fmtTime(e.time, locale),
      isoTime: e.time,
    });
    currentGroup.changeCount += 1;
  }

  return sections;
}
