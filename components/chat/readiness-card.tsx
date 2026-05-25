"use client";

import type { AppIntegration, FlowStep } from "@/lib/flow-types";
import { getStepIntegration } from "@/lib/flow-apps";

export type ReadinessCardResult = {
  flowValid: boolean;
  apps: AppIntegration[];
  message: string;
};

export function ReadinessCard({
  steps,
  checking,
  result,
  connectedApps,
  connectingAppId,
  onConnectApp,
}: {
  steps: FlowStep[];
  checking: boolean;
  result: ReadinessCardResult | null;
  connectedApps: Set<string>;
  connectingAppId: string | null;
  onConnectApp: (appId: string) => void;
}) {
  const stepsNeedingConnection = steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => {
      const integration = getStepIntegration(step);
      return integration && !connectedApps.has(integration.id);
    });

  const apps = result?.apps ?? [];
  const allAppsConnected =
    apps.length > 0 && apps.every((app) => connectedApps.has(app.id));
  const isReady =
    Boolean(result?.flowValid) &&
    (apps.length === 0 || allAppsConnected) &&
    stepsNeedingConnection.length === 0;

  return (
    <div className="w-full min-w-0 rounded-xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-emerald-100 bg-white/60">
        <span className="inline-flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-gray-800">Readiness check</div>
          <div className="text-[10px] text-gray-500">
            {steps.length} step{steps.length === 1 ? "" : "s"} in flow
          </div>
        </div>
        {!checking && result && (
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
              isReady
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isReady ? "Ready" : "Needs work"}
          </span>
        )}
      </div>

      {checking && (
        <div className="flex items-center gap-2 px-3 py-6 text-[12px] text-gray-600">
          <span className="inline-block size-4 rounded-full border-2 border-gray-300 border-t-emerald-500 animate-spin" />
          Checking flow structure and app connections…
        </div>
      )}

      {!checking && result && (
        <>
          <div className="px-3 py-2.5 border-b border-gray-100">
            <p className="text-[12px] text-gray-700 leading-relaxed">{result.message}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusPill
                ok={result.flowValid}
                label={result.flowValid ? "Structure valid" : "Structure issues"}
              />
              <StatusPill
                ok={apps.length === 0 || allAppsConnected}
                label={
                  apps.length === 0
                    ? "No apps required"
                    : allAppsConnected
                      ? "Apps connected"
                      : `${apps.filter((a) => !connectedApps.has(a.id)).length} app${apps.filter((a) => !connectedApps.has(a.id)).length === 1 ? "" : "s"} to connect`
                }
              />
            </div>
          </div>

          {apps.length > 0 && (
            <ul className="divide-y divide-gray-100">
              <li className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-50/80">
                Required connections
              </li>
              {apps.map((app) => {
                const connected = connectedApps.has(app.id);
                return (
                  <li
                    key={app.id}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <span className="text-base shrink-0">{app.icon}</span>
                    <span className="min-w-0 flex-1 text-[11px] font-medium text-gray-800 truncate">
                      {app.name}
                    </span>
                    {connected ? (
                      <span className="shrink-0 inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Connected
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onConnectApp(app.id)}
                        disabled={connectingAppId === app.id}
                        className="shrink-0 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {connectingAppId === app.id ? "Connecting…" : "Connect"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {stepsNeedingConnection.length > 0 && (
            <ul className="divide-y divide-gray-100 border-t border-red-100">
              <li className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-red-600/90 bg-red-50/50">
                Steps missing connections
              </li>
              {stepsNeedingConnection.map(({ step, index }) => {
                const integration = getStepIntegration(step);
                if (!integration) return null;
                return (
                  <li
                    key={step.id}
                    className="flex items-center gap-2 px-3 py-2 text-[11px]"
                  >
                    <span className="font-mono text-[10px] font-bold text-red-600">
                      #{index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-gray-800">{step.title}</span>
                    <span className="shrink-0 text-[10px] text-gray-500">{integration.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {!checking && !result && (
        <p className="px-3 py-4 text-[11px] text-gray-500 italic">
          Run a check to see results here.
        </p>
      )}
    </div>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
        ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
      }`}
    >
      <span className={`inline-block size-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`} />
      {label}
    </span>
  );
}
