import type { FlowStep } from "./flow-types";

export type FlowTreeNode = {
  step: FlowStep;
  index: number; // 1-based position in the original flat ordering (for step numbering)
  yes?: FlowTreeNode[];
  no?: FlowTreeNode[];
};

// Build a tree from the flat (step, depth, branch) representation.
// Rules:
//   - A root step has depth 0 and no branch.
//   - Children of a condition live at depth = condition.depth + 1 and have branch === "yes" | "no".
//   - Iteration order is preserved; a single shared cursor walks the list once.
export function buildStepTree(steps: FlowStep[]): FlowTreeNode[] {
  let i = 0;

  function parse(
    targetDepth: number,
    branchFilter: "yes" | "no" | null,
  ): FlowTreeNode[] {
    const nodes: FlowTreeNode[] = [];
    while (i < steps.length) {
      const s = steps[i];
      const d = s.depth ?? 0;

      if (d !== targetDepth) break;
      if (branchFilter === null && s.branch !== undefined) break;
      if (branchFilter !== null && s.branch !== branchFilter) break;

      const node: FlowTreeNode = { step: s, index: i + 1 };
      i++;
      if (s.kind === "condition") {
        node.yes = parse(targetDepth + 1, "yes");
        node.no = parse(targetDepth + 1, "no");
      }
      nodes.push(node);
    }
    return nodes;
  }

  return parse(0, null);
}
