"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import { ActivityPanel } from "@/components/ai/activity-panel";
import {
  SAMPLE_RESPONSE,
  SAMPLE_STEP_REGISTRY,
  SAMPLE_USER_REGISTRY,
  TODAY_RESPONSE,
  TODAY_STEP_REGISTRY,
} from "@/lib/activity/mock";

const NOW = new Date("2026-08-10T12:00:00+00:00");

// Merge the two demo datasets so the panel shows both a "Today" section
// (multi-user) and the historical July section from one payload.
const COMBINED = [...TODAY_RESPONSE, ...SAMPLE_RESPONSE];

export default function ActivityDemoPage() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-100 p-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-semibold text-neutral-900">
          Activity panel
        </h1>
        <p className="mb-6 text-neutral-600">
          Raw version-bucketed changelog → user-grouped, human-readable feed.
          Flow-level publish / pause / resume noise is hidden; friendly names are
          joined from a step registry.
        </p>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Activity
        </Button>
      </div>

      <ActivityPanel
        open={open}
        onClose={() => setOpen(false)}
        response={COMBINED}
        transformOptions={{
          now: NOW,
          locale: "en-GB",
          stepRegistry: { ...TODAY_STEP_REGISTRY, ...SAMPLE_STEP_REGISTRY },
          userRegistry: SAMPLE_USER_REGISTRY,
        }}
      />
    </div>
  );
}
