import { Suspense } from "react";
import { AiShell } from "@/components/ai/ai-shell";

export default function AiPage() {
  return (
    <Suspense fallback={null}>
      <AiShell />
    </Suspense>
  );
}
