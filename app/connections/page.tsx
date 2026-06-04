"use client";

import { useMemo, useState } from "react";
import type { AppIntegration } from "@/lib/flow-types";
import { APPS, getConnectableApps } from "@/lib/flow-apps";
import { ConnectAppDialog } from "@/components/connections/connect-app-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Icon = {
  search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  link: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
};

/** Demo state: which connectable apps appear connected in the UX preview. */
const INITIAL_CONNECTED = new Set(["slack", "gmail", "sheets", "whatsapp"]);

const ACCOUNT_LABELS: Record<string, string> = {
  slack: "MSG91 Workspace",
  gmail: "notifications@msg91.com",
  sheets: "Automation Logs",
  whatsapp: "Business API · +91 98••••••01",
  shopify: "—",
  notion: "—",
  airtable: "—",
  twilio: "—",
  crm: "—",
};

const USED_IN_FLOWS: Record<string, number> = {
  slack: 24,
  gmail: 18,
  sheets: 31,
  whatsapp: 12,
  shopify: 0,
  notion: 0,
  airtable: 0,
  twilio: 0,
  crm: 0,
};

export default function ConnectionsPage() {
  const [query, setQuery] = useState("");
  const [connected, setConnected] = useState(INITIAL_CONNECTED);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [dialogApp, setDialogApp] = useState<AppIntegration | null>(null);

  const apps = useMemo(() => getConnectableApps(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((app) => app.name.toLowerCase().includes(q));
  }, [apps, query]);

  const connectedCount = apps.filter((a) => connected.has(a.id)).length;
  const needsAttention = apps.filter((a) => !connected.has(a.id) && (USED_IN_FLOWS[a.id] ?? 0) > 0).length;

  const openConnectDialog = (app: AppIntegration) => {
    setDialogApp(app);
  };

  const closeConnectDialog = () => {
    if (!connectingId) setDialogApp(null);
  };

  const confirmConnect = () => {
    if (!dialogApp) return;
    setConnectingId(dialogApp.id);
    window.setTimeout(() => {
      setConnected((prev) => new Set(prev).add(dialogApp.id));
      setConnectingId(null);
      setDialogApp(null);
    }, 600);
  };

  const handleDisconnect = (id: string) => {
    setConnected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Connections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect apps and services used across your workflows.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Icon.plus />
          Add Connection
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">{connectedCount}</div>
            <div className="text-sm text-muted-foreground">Connected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">{apps.length - connectedCount}</div>
            <div className="text-sm text-muted-foreground">Available to connect</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            {needsAttention > 0 ? (
              <>
                <span className="text-amber-500">⚠</span>
                <div>
                  <div className="font-medium">{needsAttention} need attention</div>
                  <div className="text-sm text-muted-foreground">Used in flows but not connected</div>
                </div>
              </>
            ) : (
              <>
                <span className="text-emerald-500">✓</span>
                <div className="text-sm text-muted-foreground">All flow apps are connected</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Icon.search />
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search connections…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-medium">App</th>
                <th className="font-medium">Status</th>
                <th className="font-medium">Account</th>
                <th className="font-medium">Used in flows</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => {
                const isConnected = connected.has(app.id);
                const flows = USED_IN_FLOWS[app.id] ?? 0;
                return (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50/80">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-lg">
                          {app.icon}
                        </span>
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-xs text-muted-foreground">{app.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {isConnected ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Connected</Badge>
                      ) : flows > 0 ? (
                        <Badge variant="destructive">Missing</Badge>
                      ) : (
                        <Badge variant="outline">Not connected</Badge>
                      )}
                    </td>
                    <td className="text-muted-foreground">{isConnected ? ACCOUNT_LABELS[app.id] ?? "—" : "—"}</td>
                    <td>{flows > 0 ? flows : "—"}</td>
                    <td className="p-4">
                      {isConnected ? (
                        <Button variant="outline" size="sm" onClick={() => handleDisconnect(app.id)}>
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex items-center gap-1.5"
                          onClick={() => openConnectDialog(app)}
                          disabled={connectingId === app.id}
                        >
                          <Icon.link />
                          Connect
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No connections match &ldquo;{query}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Browse apps</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.values(APPS)
            .filter((a) => !getConnectableApps().some((c) => c.id === a.id))
            .map((app) => (
              <span
                key={app.id}
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm text-muted-foreground"
              >
                <span>{app.icon}</span>
                {app.name}
                <span className="text-[10px] uppercase text-gray-400">built-in</span>
              </span>
            ))}
        </div>
      </div>

      {dialogApp && (
        <ConnectAppDialog
          app={dialogApp}
          open={Boolean(dialogApp)}
          connecting={connectingId === dialogApp.id}
          onClose={closeConnectDialog}
          onConnect={confirmConnect}
        />
      )}
    </div>
  );
}
