import { Suspense } from "react";
import { AiShellV6 } from "@/components/ai/ai-shell-v6";

export default function Ai6Page() {
  return (
    <Suspense fallback={null}>
      <AiShellV6 />
    </Suspense>
  );
}
