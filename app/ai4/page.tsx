import { Suspense } from "react";
import { AiShellV4 } from "@/components/ai/ai-shell-v4";

export default function Ai4Page() {
  return (
    <Suspense fallback={null}>
      <AiShellV4 />
    </Suspense>
  );
}
