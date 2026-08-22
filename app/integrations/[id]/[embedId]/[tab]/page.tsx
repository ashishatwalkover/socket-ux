"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { cn } from "@/lib/utils";
import { APP_BASE } from "@/lib/app-routes";
import { getEmbed } from "@/lib/embeds-data";
import { Configuration } from "@/components/integrations/configuration";
import { MyApp } from "@/components/integrations/my-app";
import { FilterAvailableApps } from "@/components/integrations/filter-available-apps";

/* ─── Icons ─── */
const I = {
  back: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  home: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10"/></svg>),
  edit: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>),
  setup: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>),
  guide: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>),
  config: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>),
  metrics: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  myApp: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>),
  filter: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
  theme: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>),
  billing: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>),
  info: (p: React.SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>),
};

const TABS = [
  { slug: "setup", label: "Setup", icon: I.setup },
  { slug: "integration-guide", label: "Integration Guide", icon: I.guide },
  { slug: "configuration", label: "Configuration", icon: I.config },
  { slug: "metrics", label: "Metrics", icon: I.metrics },
  { slug: "my-app", label: "My App", icon: I.myApp },
  { slug: "filter-available-apps", label: "Filter Available Apps", icon: I.filter },
  { slug: "theme-configuration", label: "Theme Configuration", icon: I.theme },
  { slug: "billing", label: "Billing", icon: I.billing },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outlined"
      size="small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      sx={{ minWidth: 64 }}
    >
      {copied ? "COPIED" : "COPY"}
    </Button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-10">
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 pr-24 text-sm leading-relaxed text-gray-800">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

function SetupEmbed({ orgId, embedId, secret }: { orgId: string; embedId: string; secret: string }) {
  const payload = `{
  "org_id": "${orgId}",
  "project_id": "${embedId}",
  "unique_identifier": "<unique_identifier_to_isolate_flows>"
}`;
  const script = `<button onclick="openViasocket()">
  Open Integrations
</button>

<script
  id="viasocket-embed-main-script"
  src="https://embed.viasocket.com/prod-embedcomponent.js"
  embedToken="YOUR_GENERATED_EMBED_TOKEN">
</script>`;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">Setup Embed</h1>

      {/* Step 1 */}
      <h2 className="mt-8 text-xl font-semibold text-gray-900">
        Step 1 — Generate Your Embed Token (JWT)
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        This is a JWT token—generate it using your payload and secret key.
      </p>

      <p className="mt-5 text-sm font-medium text-gray-700">Payload</p>
      <div className="mt-1.5">
        <CodeBlock code={payload} />
      </div>

      <div className="mt-3 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <span className="mt-0.5 text-blue-500"><I.info /></span>
        <div>
          <p className="text-sm font-semibold text-gray-800">unique_identifier</p>
          <p className="mt-0.5 text-sm text-gray-600">
            A unique ID/name to isolate the flows and connections from each other.
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-gray-700">Secret</p>
      <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
        <code className="flex-1 truncate font-mono text-sm text-gray-800">{secret}</code>
        <CopyButton text={secret} />
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Use this secret to sign the payload and generate your embedToken.
      </p>

      <div className="mt-3 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <span className="mt-0.5 text-blue-500"><I.info /></span>
        <p className="text-sm text-gray-600">
          If you&apos;re new to JWTs, you can generate one sample using{" "}
          <a
            href="https://jwt.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            jwt.io
          </a>
          . Generate the JWT on your backend and pass it securely to the frontend.
        </p>
      </div>

      {/* Step 2 */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">
        Step 2 — Add the Embed Script in Your Code
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Paste this into your code and pass the token dynamically:
      </p>
      <div className="mt-3">
        <CodeBlock code={script} />
      </div>
    </div>
  );
}

const GUIDE_ITEMS: { title: string; body: React.ReactNode }[] = [
  {
    title: "openViasocket()",
    body: (
      <>
        <p className="mb-3 text-sm text-gray-600">
          Call this global function to open the viaSocket embed modal. Attach it to any button or trigger in your product.
        </p>
        <CodeBlock code={`<button onclick="openViasocket()">Open Integrations</button>`} />
      </>
    ),
  },
  {
    title: "handleClose()",
    body: (
      <>
        <p className="mb-3 text-sm text-gray-600">
          Define a <code className="font-mono text-gray-800">handleClose</code> callback to run your own logic when the user closes the embed.
        </p>
        <CodeBlock code={`window.handleClose = () => {\n  console.log("Embed closed");\n};`} />
      </>
    ),
  },
  {
    title: "configurationJson (Pre-fill Data)",
    body: (
      <>
        <p className="mb-3 text-sm text-gray-600">
          Pass a configuration object to pre-fill fields, preselect apps, or seed flow data when the embed opens.
        </p>
        <CodeBlock code={`window.configurationJson = {\n  prefill: {\n    email: "user@example.com",\n    apps: ["slack", "gmail"],\n  },\n};`} />
      </>
    ),
  },
  {
    title: "configurationJsonEncrypted",
    body: (
      <>
        <p className="mb-3 text-sm text-gray-600">
          For sensitive pre-fill data, pass an encrypted payload signed with your secret. viaSocket decrypts it server-side.
        </p>
        <CodeBlock code={`window.configurationJsonEncrypted = "<your-encrypted-jwt>";`} />
      </>
    ),
  },
  {
    title: "Method to Receive Data from Embed",
    body: (
      <>
        <p className="mb-3 text-sm text-gray-600">
          Listen for <code className="font-mono text-gray-800">postMessage</code> events to receive data and lifecycle events from the embed.
        </p>
        <CodeBlock code={`window.addEventListener("message", (event) => {\n  if (event.data?.source !== "viasocket-embed") return;\n  console.log("Event:", event.data.type, event.data.payload);\n});`} />
      </>
    ),
  },
  {
    title: "Workflow APIs",
    body: (
      <>
        <p className="mb-3 text-sm text-gray-600">
          Manage flows programmatically — list, create, enable, or disable a user&apos;s flows with the Workflow REST APIs.
        </p>
        <CodeBlock code={`GET https://api.viasocket.com/v1/flows\nAuthorization: Bearer <embedToken>`} />
      </>
    ),
  },
  {
    title: "Webhooks",
    body: (
      <>
        <p className="mb-3 text-sm text-gray-600">
          Register a webhook URL to receive flow events (runs, errors, status changes) on your backend.
        </p>
        <CodeBlock code={`POST https://api.viasocket.com/v1/webhooks\n{\n  "url": "https://yourapp.com/hooks/viasocket",\n  "events": ["flow.run", "flow.error"]\n}`} />
      </>
    ),
  },
];

function IntegrationGuide() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">Integration Guide (Optional)</h1>
      <p className="mt-2 text-gray-500">
        Everything you need to control the embed, prefill data, manage flows, and receive events.
      </p>

      <div className="mt-6">
        {GUIDE_ITEMS.map((item) => (
          <Accordion
            key={item.title}
            variant="outlined"
            disableGutters
            sx={{
              mb: 1.5,
              "&:before": { display: "none" },
              "&.Mui-expanded": { my: 0, mb: 1.5 },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 0.5 }}>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 500, color: "text.primary" }}>
                {item.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>{item.body}</AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">{label}</h1>
      <p className="mt-3 text-sm text-gray-500">This section is coming soon.</p>
    </div>
  );
}

export default function EmbedDetailPage() {
  const params = useParams<{ id: string; embedId: string; tab: string }>();
  const orgId = params?.id ?? "";
  const embedId = params?.embedId ?? "";
  const tab = params?.tab ?? "setup";

  const embed = getEmbed(embedId);
  const embedName = embed?.name ?? embedId;
  const secret = embed?.secret ?? "your-embed-secret-key";
  const activeTab = TABS.find((t) => t.slug === tab);

  return (
    <div className="flex min-h-full">
      {/* Embed sub-navigation */}
      <aside className="sticky top-0 h-screen w-64 shrink-0 self-start overflow-y-auto border-r border-gray-200 bg-white">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 border-b border-gray-200 px-3 py-2 text-xs text-gray-500">
          <Link href={APP_BASE} className="flex items-center gap-1 hover:text-gray-900">
            <I.home />
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link href={`/integrations/${orgId}`} className="truncate hover:text-gray-900">
            Integrations
          </Link>
        </nav>
        <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-3.5">
          <IconButton
            component={Link}
            href={`/integrations/${orgId}`}
            size="small"
            aria-label="Back to embeds"
            sx={{ color: "text.secondary" }}
          >
            <I.back />
          </IconButton>
          <span className="flex-1 truncate text-[15px] font-semibold text-gray-900">
            {embedName}
          </span>
          <IconButton size="small" aria-label="Rename embed" sx={{ color: "text.secondary" }}>
            <I.edit />
          </IconButton>
        </div>

        <nav className="p-2">
          {TABS.map((t) => {
            const active = t.slug === tab;
            const Icon = t.icon;
            return (
              <Link
                key={t.slug}
                href={`/integrations/${orgId}/${embedId}/${t.slug}`}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <span className={active ? "text-gray-900" : "text-gray-400"}>
                  <Icon />
                </span>
                {t.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content — no overflow container here so children can use `sticky`
          relative to the app's main scroll area. */}
      <div className="min-w-0 flex-1 px-10 py-8">
        {tab === "setup" ? (
          <SetupEmbed orgId={orgId} embedId={embedId} secret={secret} />
        ) : tab === "integration-guide" ? (
          <IntegrationGuide />
        ) : tab === "configuration" ? (
          <Configuration />
        ) : tab === "my-app" ? (
          <MyApp />
        ) : tab === "filter-available-apps" ? (
          <FilterAvailableApps />
        ) : (
          <Placeholder label={activeTab?.label ?? "Not found"} />
        )}
      </div>
    </div>
  );
}
