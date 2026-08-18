// Mock inputs for the Activity panel: the real sample changelog plus the
// registries we join it against, and a second "today" dataset with two authors
// to exercise the user-grouping + date-header layout from the design.

import type {
  RawActivityResponse,
  StepRegistry,
  UserRegistry,
} from "./types";

/** Friendly labels + kinds for the sample payload's cryptic step ids. */
export const SAMPLE_STEP_REGISTRY: StepRegistry = {
  func64MuVnjx: { displayName: "Format Data", kind: "step" },
  funcbtdPKelx: { displayName: "Enrich Payload", kind: "step" },
  funcoyzvwdeW: { displayName: "Transform Body", kind: "step" },
  funcYtZ7dY1J: { displayName: "Debug Log", kind: "step" },
  ifcbT37CzjCr: { displayName: "Body Exists", kind: "condition" },
  ifcbYftZS0g6: { displayName: "Body Exists (2)", kind: "condition" },
  ifcblPQ5Pcy5: { displayName: "Query Exists", kind: "condition" },
  swtcT37CzjCr: { displayName: "Route by Body", kind: "multipath" },
  swtcYftZS0g6: { displayName: "Route by Body 2", kind: "multipath" },
  swtclPQ5Pcy5: { displayName: "Route by Query", kind: "multipath" },
};

export const SAMPLE_USER_REGISTRY: UserRegistry = {
  "119784": { name: "Ashish Yadav" },
  "220145": { name: "Maya Rodriguez" },
};

/** The exact changelog payload from the ticket. */
export const SAMPLE_RESPONSE: RawActivityResponse = [
  {
    user_id: "119784",
    version: 5,
    operations: [
      { operation: "publish", step_type: "flow", step_name: null, step_id: null, time: "2026-07-17T11:59:44.821+00:00" },
    ],
  },
  {
    user_id: "119784",
    version: 4,
    operations: [
      { operation: "publish", step_type: "flow", step_name: null, step_id: null, time: "2026-07-17T11:59:01.962+00:00" },
      { operation: "delete", step_type: "action", step_name: "body_exists", step_id: "ifcbT37CzjCr", time: "2026-07-17T11:59:05.524+00:00" },
      { operation: "delete", step_type: "action", step_name: "body_exists_1", step_id: "ifcbYftZS0g6", time: "2026-07-17T11:59:20.426+00:00" },
    ],
  },
  {
    user_id: "119784",
    version: 3,
    operations: [
      { operation: "publish", step_type: "flow", step_name: null, step_id: null, time: "2026-07-17T11:55:50.344+00:00" },
      { operation: "delete", step_type: "pre_process", step_name: "preProcess", step_id: null, time: "2026-07-17T11:56:03.663+00:00" },
      { operation: "delete", step_type: "loop", step_name: "loops", step_id: null, time: "2026-07-17T11:56:03.663+00:00" },
      { operation: "move", step_type: "flow", step_name: null, step_id: null, time: "2026-07-17T11:56:18.079+00:00" },
      { operation: "create", step_type: "action", step_name: "swtcT37CzjCr", step_id: "swtcT37CzjCr", time: "2026-07-17T11:56:28.92+00:00" },
      { operation: "update", step_type: "action", step_name: "body_exists", step_id: "ifcbT37CzjCr", time: "2026-07-17T11:56:36.777+00:00" },
      { operation: "update", step_type: "action", step_name: "body_exists", step_id: "ifcbT37CzjCr", time: "2026-07-17T11:56:36.777+00:00" },
      { operation: "create", step_type: "action", step_name: "swtcYftZS0g6", step_id: "swtcYftZS0g6", time: "2026-07-17T11:57:11.859+00:00" },
      { operation: "update", step_type: "action", step_name: "body_exists_1", step_id: "ifcbYftZS0g6", time: "2026-07-17T11:57:17.49+00:00" },
      { operation: "update", step_type: "action", step_name: "body_exists_1", step_id: "ifcbYftZS0g6", time: "2026-07-17T11:57:17.49+00:00" },
      { operation: "create", step_type: "action", step_name: "swtclPQ5Pcy5", step_id: "swtclPQ5Pcy5", time: "2026-07-17T11:57:43.682+00:00" },
      { operation: "update", step_type: "action", step_name: "query_exists", step_id: "ifcblPQ5Pcy5", time: "2026-07-17T11:57:57.416+00:00" },
      { operation: "update", step_type: "action", step_name: "query_exists", step_id: "ifcblPQ5Pcy5", time: "2026-07-17T11:58:01.415+00:00" },
      { operation: "reorder", step_type: "action", step_name: "swtclPQ5Pcy5", step_id: "swtclPQ5Pcy5", time: "2026-07-17T11:58:43.837+00:00" },
      { operation: "reorder", step_type: "action", step_name: "swtcT37CzjCr", step_id: "swtcT37CzjCr", time: "2026-07-17T11:58:56.841+00:00" },
    ],
  },
  {
    user_id: "119784",
    version: 2,
    operations: [
      { operation: "publish", step_type: "flow", step_name: null, step_id: null, time: "2026-07-17T11:55:38.461+00:00" },
      { operation: "delete", step_type: "action", step_name: "JS_Code_2", step_id: "funcoyzvwdeW", time: "2026-07-17T11:55:46.98+00:00" },
      { operation: "delete", step_type: "action", step_name: "JS_Code", step_id: "func64MuVnjx", time: "2026-07-17T11:55:49.19+00:00" },
    ],
  },
  {
    user_id: "119784",
    version: 1,
    operations: [
      { operation: "publish", step_type: "flow", step_name: null, step_id: null, time: "2026-07-17T11:54:42.266+00:00" },
      { operation: "update", step_type: "action", step_name: "JS_Code_2", step_id: "funcoyzvwdeW", time: "2026-07-17T11:55:31.752+00:00" },
    ],
  },
  {
    user_id: "119784",
    version: 0,
    operations: [
      { operation: "create", step_type: "flow", step_name: null, step_id: null, time: "2026-07-17T10:57:33.658+00:00" },
      { operation: "change", step_type: "trigger", step_name: "webhook", step_id: null, time: "2026-07-17T10:57:33.685+00:00" },
      { operation: "create", step_type: "pre_process", step_name: "preProcess", step_id: null, time: "2026-07-17T10:57:48.024+00:00" },
      { operation: "update", step_type: "pre_process", step_name: "preProcess", step_id: null, time: "2026-07-17T10:58:00.131+00:00" },
      { operation: "create", step_type: "loop", step_name: "loops", step_id: null, time: "2026-07-17T10:58:12.094+00:00" },
      { operation: "update", step_type: "loop", step_name: "loops", step_id: null, time: "2026-07-17T10:58:14.84+00:00" },
      { operation: "update", step_type: "loop", step_name: "loops", step_id: null, time: "2026-07-17T10:58:17.595+00:00" },
      { operation: "update", step_type: "loop", step_name: "loops", step_id: null, time: "2026-07-17T10:58:20.494+00:00" },
      { operation: "create", step_type: "precondition", step_name: "preCondition", step_id: null, time: "2026-07-17T10:58:28.17+00:00" },
      { operation: "update", step_type: "precondition", step_name: "preCondition", step_id: null, time: "2026-07-17T10:59:17.714+00:00" },
      { operation: "update", step_type: "precondition", step_name: "preCondition", step_id: null, time: "2026-07-17T10:59:25.069+00:00" },
      { operation: "update", step_type: "precondition", step_name: "preCondition", step_id: null, time: "2026-07-17T10:59:29.121+00:00" },
      { operation: "delete", step_type: "precondition", step_name: "preCondition", step_id: null, time: "2026-07-17T10:59:32.32+00:00" },
      { operation: "update", step_type: "response", step_name: "response", step_id: "response", time: "2026-07-17T10:59:43.83+00:00" },
      { operation: "update", step_type: "response", step_name: "response", step_id: "response", time: "2026-07-17T10:59:49.69+00:00" },
      { operation: "create", step_type: "action", step_name: "JS_Code", step_id: "func64MuVnjx", time: "2026-07-17T10:59:56.786+00:00" },
      { operation: "update", step_type: "action", step_name: "JS_Code", step_id: "func64MuVnjx", time: "2026-07-17T11:00:03.114+00:00" },
      { operation: "update", step_type: "action", step_name: "JS_Code", step_id: "func64MuVnjx", time: "2026-07-17T11:00:03.114+00:00" },
      { operation: "create", step_type: "action", step_name: "JS_Code_1", step_id: "funcbtdPKelx", time: "2026-07-17T11:00:24.865+00:00" },
      { operation: "update", step_type: "action", step_name: "JS_Code_1", step_id: "funcbtdPKelx", time: "2026-07-17T11:00:37.322+00:00" },
      { operation: "update", step_type: "action", step_name: "JS_Code_1", step_id: "funcbtdPKelx", time: "2026-07-17T11:00:37.323+00:00" },
      { operation: "update", step_type: "action", step_name: "JS_Code_1", step_id: "funcbtdPKelx", time: "2026-07-17T11:02:01.993+00:00" },
      { operation: "create", step_type: "action", step_name: "JS_Code_2", step_id: "funcoyzvwdeW", time: "2026-07-17T11:02:12.943+00:00" },
      { operation: "create", step_type: "action", step_name: "JS_Code_3", step_id: "funcYtZ7dY1J", time: "2026-07-17T11:07:09.269+00:00" },
      { operation: "update", step_type: "action", step_name: "JS_Code_3", step_id: "funcYtZ7dY1J", time: "2026-07-17T11:07:23.176+00:00" },
      { operation: "delete", step_type: "action", step_name: "JS_Code_3", step_id: "funcYtZ7dY1J", time: "2026-07-17T11:07:36.217+00:00" },
      { operation: "pause", step_type: "action", step_name: "JS_Code_1", step_id: "funcbtdPKelx", time: "2026-07-17T11:07:42.438+00:00" },
      { operation: "delete", step_type: "action", step_name: "JS_Code_1", step_id: "funcbtdPKelx", time: "2026-07-17T11:07:48.101+00:00" },
      { operation: "pause", step_type: "flow", step_name: null, step_id: null, time: "2026-07-17T11:54:27.923+00:00" },
      { operation: "resume", step_type: "flow", step_name: null, step_id: null, time: "2026-07-17T11:54:35.263+00:00" },
    ],
  },
];

/**
 * A second dataset stamped for "today" (2026-08-10) with two authors, so the
 * panel demonstrates the multi-user grouping + "Today" header from the design.
 */
export const TODAY_RESPONSE: RawActivityResponse = [
  {
    user_id: "220145",
    version: 8,
    operations: [
      { operation: "create", step_type: "loop", step_name: "loops", step_id: null, time: "2026-08-10T09:44:00+00:00" },
      { operation: "update", step_type: "loop", step_name: "loops", step_id: null, time: "2026-08-10T09:48:00+00:00" },
      { operation: "delete", step_type: "loop", step_name: "loops", step_id: null, time: "2026-08-10T09:52:00+00:00" },
    ],
  },
  {
    user_id: "119784",
    version: 9,
    operations: [
      { operation: "create", step_type: "action", step_name: "log_sheet", step_id: "funcLog2Sheet", time: "2026-08-10T10:00:00+00:00" },
      { operation: "update", step_type: "action", step_name: "slack_msg", step_id: "funcSlackMsg1", time: "2026-08-10T10:04:00+00:00" },
      { operation: "create", step_type: "action", step_name: "notify", step_id: "swtcNotifyUX", time: "2026-08-10T10:30:00+00:00" },
      { operation: "update", step_type: "action", step_name: "notify", step_id: "swtcNotifyUX", time: "2026-08-10T10:34:00+00:00" },
      { operation: "delete", step_type: "action", step_name: "notify", step_id: "swtcNotifyUX", time: "2026-08-10T10:38:00+00:00" },
    ],
  },
  {
    user_id: "220145",
    version: 10,
    operations: [
      { operation: "create", step_type: "precondition", step_name: "preCondition", step_id: null, time: "2026-08-10T10:50:00+00:00" },
      { operation: "update", step_type: "precondition", step_name: "preCondition", step_id: null, time: "2026-08-10T10:54:00+00:00" },
      { operation: "delete", step_type: "precondition", step_name: "preCondition", step_id: null, time: "2026-08-10T10:58:00+00:00" },
    ],
  },
  {
    user_id: "119784",
    version: 11,
    operations: [
      { operation: "update", step_type: "response", step_name: "response", step_id: "response", time: "2026-08-10T11:10:00+00:00" },
    ],
  },
];

export const TODAY_STEP_REGISTRY: StepRegistry = {
  funcLog2Sheet: { displayName: "Log to Sheet", kind: "step" },
  funcSlackMsg1: { displayName: "Send Slack Message", kind: "step" },
  swtcNotifyUX: { displayName: "Notify Team", kind: "multipath" },
};
