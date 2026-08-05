import { Suspense } from "react";
import { AiShellV5 } from "@/components/ai/ai-shell-v5";

export default function Ai5Page() {
  return (
    <Suspense fallback={null}>
      <AiShellV5 />
    </Suspense>
  );
}
