"use client";

import { AutomationBuilder } from "@/components/ai/automation-builder";

export default function AutomationBuilderPage() {
  return (
    <AutomationBuilder
      onBack={() => window.history.back()}
      onCreate={(selection) =>
        console.log("Create automation", selection)
      }
    />
  );
}
