import { Suspense } from "react";
import { AiShellV7 } from "@/components/ai/ai-shell-v7";

export default function Ai7Page() {
  return (
    <Suspense fallback={null}>
      <AiShellV7 />
    </Suspense>
  );
}
