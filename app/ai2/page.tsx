import { Suspense } from "react";
import { AiShell } from "@/components/ai/ai-shell";

export default function Ai2Page() {
  return (
    <Suspense fallback={null}>
      <AiShell />
    </Suspense>
  );
}
