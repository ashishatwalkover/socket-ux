"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Paper } from "@mui/material";
import { EMBEDS } from "@/lib/embeds-data";
import { APP_BASE } from "@/lib/app-routes";

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 12l9-9 9 9" /><path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10" />
  </svg>
);

/* ─── Icons ─── */
const WebhookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
    <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
    <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
  </svg>
);
const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
);
const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);
const BookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function EmbedIntegrationsPage() {
  const params = useParams<{ id: string }>();
  const orgId = params?.id ?? "";
  return (
    <div className="min-h-full bg-[#fafbfc] px-10 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-gray-500">
          <Link href={APP_BASE} className="flex items-center gap-1 hover:text-gray-900">
            <HomeIcon />
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-gray-900">Integrations</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Embed viaSocket into your product
          </h1>
          <div className="flex items-center gap-3">
            <Button
              variant="text"
              startIcon={<BookIcon />}
              sx={{ color: "#2563eb", fontWeight: 600, letterSpacing: "0.02em" }}
            >
              KNOWLEDGE BASE
            </Button>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              sx={{ bgcolor: "#2563eb", fontWeight: 600, letterSpacing: "0.02em", px: 2.5, "&:hover": { bgcolor: "#1d4ed8" } }}
            >
              CREATE NEW EMBED
            </Button>
          </div>
        </div>
        <p className="mt-3 text-lg text-gray-500">
          Embed is the fastest way to add viaSocket to your product.
        </p>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EMBEDS.map((embed) => (
            <Link
              key={embed.projectId}
              href={`/integrations/${orgId}/${embed.projectId}/setup`}
              className="block"
            >
            <Paper
              variant="outlined"
              className="cursor-pointer transition-shadow hover:shadow-md"
            >
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-gray-500">
                    <WebhookIcon />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-gray-900">{embed.name}</h3>
                    <p className="truncate text-sm text-gray-400">{embed.projectId}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <TagIcon className="shrink-0 text-gray-400" />
                    <span className="truncate">{embed.tag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GlobeIcon className="shrink-0 text-gray-400" />
                    <span className="truncate">{embed.domain}</span>
                  </div>
                </div>
              </div>
            </Paper>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

