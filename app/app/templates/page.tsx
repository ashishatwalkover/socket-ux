"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

/* ─── Types ─── */
type TemplateApp = { name: string; color: string; letter: string };

type Template = {
  id: string;
  title: string;
  apps: TemplateApp[];
  installs: number;
  useCase: string;
  product: "Flow" | "AI Agent" | "Table";
  featured?: boolean;
  recommended?: boolean;
};

/* ─── Icons ─── */
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15V4a2 2 0 0 1 2-2h9" />
  </svg>
);

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z" />
    <path d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3z" />
  </svg>
);

/* ─── Sample Data ─── */
const USE_CASES = ["All", "Sales", "Marketing", "Support", "Operations", "HR", "Finance", "IT"];
const APPS = ["All", "Shopify", "Gmail", "Slack", "HubSpot", "Google Sheets", "WhatsApp", "Airtable"];
const MORE_APPS = [
  "Notion", "Trello", "Asana", "Jira", "GitHub", "GitLab", "Bitbucket",
  "Salesforce", "Zendesk", "Intercom", "Mailchimp", "SendGrid", "Twilio",
  "Stripe", "PayPal", "Square", "QuickBooks", "Xero", "Zoom", "Microsoft Teams",
  "Discord", "Telegram", "Twitter", "LinkedIn", "Facebook", "Instagram",
  "Dropbox", "OneDrive", "Box", "Calendly", "Typeform", "SurveyMonkey",
  "Pipedrive", "Freshdesk", "ClickUp", "Monday.com", "Linear", "Figma",
];
const PRODUCTS = ["All", "Flow", "AI Agent", "Table"];

const ALL_TEMPLATES: Template[] = [
  {
    id: "t1",
    title: "Automate Lead Capture to Google Sheets from a Webhook",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
    ],
    installs: 46,
    useCase: "Sales",
    product: "Flow",
    featured: true,
    recommended: true,
  },
  {
    id: "t2",
    title: "Email a Daily Work Summary from Google Sheets via Gmail",
    apps: [
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
      { name: "Google Drive", color: "bg-emerald-500", letter: "D" },
    ],
    installs: 13,
    useCase: "Marketing",
    product: "Flow",
  },
  {
    id: "t3",
    title: "Auto-Send Gmail from New or Updated Google Sheets Rows",
    apps: [
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      { name: "Gmail", color: "bg-red-500", letter: "M" },
    ],
    installs: 6,
    useCase: "Sales",
    product: "Flow",
    recommended: true,
  },
  {
    id: "t4",
    title: "Pull the latest rows from Google Sheets on demand (webhook)",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
    ],
    installs: 5,
    useCase: "IT",
    product: "Flow",
  },
  {
    id: "t5",
    title: "Delay Webhook Events By 15 Minutes",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
    ],
    installs: 4,
    useCase: "Operations",
    product: "Flow",
  },
  {
    id: "t6",
    title: "Turn '20 min' into a 20-minute wait",
    apps: [
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "HubSpot", color: "bg-orange-500", letter: "H" },
    ],
    installs: 1,
    useCase: "Support",
    product: "Flow",
  },
  {
    id: "t7",
    title: "Forward Webhook to AI Agent (MCP) and Return the Response",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "OpenAI", color: "bg-slate-800", letter: "A" },
    ],
    installs: 30,
    useCase: "IT",
    product: "AI Agent",
    recommended: true,
  },
  {
    id: "t8",
    title: "Automate Webhook Health Check Acknowledgment",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
    ],
    installs: 24,
    useCase: "Operations",
    product: "Flow",
  },
  {
    id: "t9",
    title: "Automate On-Demand Airtable Table Export via Webhook",
    apps: [
      { name: "Webhook", color: "bg-emerald-500", letter: "W" },
      { name: "Airtable", color: "bg-blue-500", letter: "A" },
    ],
    installs: 14,
    useCase: "Operations",
    product: "Flow",
  },
  {
    id: "t10",
    title: "Automate User Input Collection for Processing",
    apps: [
      { name: "Google Forms", color: "bg-violet-500", letter: "F" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
      { name: "Airtable", color: "bg-blue-500", letter: "A" },
    ],
    installs: 9,
    useCase: "HR",
    product: "Flow",
  },
  {
    id: "t11",
    title: "Test Plugin Workflow",
    apps: [
      { name: "Shopify", color: "bg-emerald-600", letter: "S" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
    ],
    installs: 30,
    useCase: "Operations",
    product: "Flow",
  },
  {
    id: "t12",
    title: "Automate Date Formatting to DD-MM-YYYY",
    apps: [
      { name: "Google Sheets", color: "bg-emerald-600", letter: "G" },
      { name: "Slack", color: "bg-purple-600", letter: "S" },
    ],
    installs: 5,
    useCase: "Finance",
    product: "Flow",
  },
];

/* ─── Components ─── */
function AppBadge({ app }: { app: TemplateApp }) {
  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white",
        app.color
      )}
      title={app.name}
    >
      {app.letter}
    </span>
  );
}

function TemplateCard({ template, onClick }: { template: Template; onClick: () => void }) {
  return (
    <div
      className="group relative flex flex-col rounded-xl border border-border/70 bg-background p-4 transition-shadow hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      {/* Header: app badges + copy */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {template.apps.map((app) => (
            <AppBadge key={app.name} app={app} />
          ))}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Use template"
        >
          <CopyIcon className="size-4" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 mb-1">
        {template.title}
      </h3>

      {/* Footer */}
      <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{template.installs}</span>
        <span>uses</span>
        {template.featured && (
          <span className="ml-auto inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            Featured
          </span>
        )}
      </div>
    </div>
  );
}

function FeaturedTemplate({ template, onClick }: { template: Template; onClick: () => void }) {
  return (
    <div
      className="relative flex items-start gap-5 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 p-6 cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
            <SparklesIcon className="size-3 mr-1" />
            Featured
          </Badge>
          <span className="text-xs text-muted-foreground">{template.useCase}</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground leading-snug mb-2">{template.title}</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {template.apps.map((app) => (
              <AppBadge key={app.name} app={app} />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{template.installs}</span> uses
          </span>
        </div>
      </div>
      <Button
        size="sm"
        className="shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        Use Template
      </Button>
    </div>
  );
}

/* ─── Main Page ─── */
export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [useCases, setUseCases] = useState<Set<string>>(new Set());
  const [apps, setApps] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"popularity" | "newest" |"name">("popularity");
  const [showMyTemplates, setShowMyTemplates] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Set<"usecase" | "app" | "product">>(new Set());
  const [showAppPopover, setShowAppPopover] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const [addedApps, setAddedApps] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: "usecase" | "app" | "product") => {
    const next = new Set(expandedFilters);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedFilters(next);
  };

  const toggleUseCase = (uc: string) => {
    if (uc === "All") {
      setUseCases(new Set());
      return;
    }
    const next = new Set(useCases);
    if (next.has(uc)) next.delete(uc);
    else next.add(uc);
    setUseCases(next);
  };

  const toggleApp = (app: string) => {
    if (app === "All") {
      setApps(new Set());
      return;
    }
    const next = new Set(apps);
    if (next.has(app)) next.delete(app);
    else next.add(app);
    setApps(next);
  };

  const toggleProduct = (product: string) => {
    if (product === "All") {
      setProducts(new Set());
      return;
    }
    const next = new Set(products);
    if (next.has(product)) next.delete(product);
    else next.add(product);
    setProducts(next);
  };

  const handleOpenTemplate = (id: string) => {
    router.push(`/app/templates/${id}`);
  };

  const filtered = useMemo(() => {
    let list = ALL_TEMPLATES;

    // Search: empty spaces allowed (simple substring match)
    const q = search.toLowerCase().replace(/\s+/g, " ").trim();
    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.useCase.toLowerCase().includes(q) ||
          t.apps.some((a) => a.name.toLowerCase().includes(q)) ||
          t.product.toLowerCase().includes(q)
      );
    }

    if (useCases.size > 0) {
      list = list.filter((t) => useCases.has(t.useCase));
    }
    if (apps.size > 0) {
      list = list.filter((t) => t.apps.some((a) => apps.has(a.name)));
    }
    if (products.size > 0) {
      list = list.filter((t) => products.has(t.product));
    }

    // Filter by my templates (mock: show only first 3 as "my templates")
    if (showMyTemplates) {
      list = list.filter((_, i) => i < 3);
    }

    // Sort
    if (sortBy === "popularity") {
      list = [...list].sort((a, b) => b.installs - a.installs);
    } else if (sortBy === "name") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list = [...list];
    }
    // Always bring featured templates to the top
    list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

    return list;
  }, [search, useCases, apps, products, sortBy, showMyTemplates]);

  const featured = useMemo(() => ALL_TEMPLATES.find((t) => t.featured), []);
  const recommended = useMemo(() => ALL_TEMPLATES.filter((t) => t.recommended), []);

  return (
    <div className="min-h-full bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Templates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Discover and install ready-made automations
          </p>
        </div>
        <Button variant="default" size="sm">
          Create New Flow
        </Button>
      </div>

      {/* Search + Sort + My Templates */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-lg">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates, apps, use cases..."
            className="pl-9 pr-4"
          />
        </div>
        
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-8 appearance-none rounded-lg border border-input bg-background px-3 pr-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="newest">Sort by Newest</option>
            <option value="name">Sort by Name</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        </div>

        {/* Filter Chips Row */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-medium text-muted-foreground shrink-0">Filter:</span>
          
          {/* My Templates Chip */}
          <button
            onClick={() => setShowMyTemplates(!showMyTemplates)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              showMyTemplates
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:bg-muted"
            )}
          >
            My Templates
          </button>

          {/* Use Case Chip */}
          <button
            onClick={() => toggleExpanded("usecase")}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              expandedFilters.has("usecase")
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:bg-muted"
            )}
          >
            Use Case
          </button>

          {/* Apps Chip */}
          <button
            onClick={() => toggleExpanded("app")}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              expandedFilters.has("app")
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:bg-muted"
            )}
          >
            Apps
          </button>

          {/* Product Chip */}
          <button
            onClick={() => toggleExpanded("product")}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              expandedFilters.has("product")
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:bg-muted"
            )}
          >
            Product
          </button>
        </div>                
      </div>      

      {/* Expanded Filter Options */}
      {expandedFilters.size > 0 && (
        <div className="mb-5 space-y-3">
          {/* Use Cases Options */}
          {expandedFilters.has("usecase") && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-medium text-muted-foreground shrink-0">Use Case:</span>
              {USE_CASES.map((uc) => (
                <button
                  key={uc}
                  onClick={() => toggleUseCase(uc)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    (uc === "All" ? useCases.size === 0 : useCases.has(uc))
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {uc}
                </button>
              ))}
            </div>
          )}

          {/* Apps Options */}
          {expandedFilters.has("app") && (
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className="text-xs font-medium text-muted-foreground shrink-0">App:</span>
              {APPS.map((app) => (
                <button
                  key={app}
                  onClick={() => toggleApp(app)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    (app === "All" ? apps.size === 0 : apps.has(app))
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {app}
                </button>
              ))}
              {/* Show added MORE_APPS as chips (persist even when deselected) */}
              {Array.from(addedApps).map((app) => (
                <button
                  key={app}
                  onClick={() => toggleApp(app)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    apps.has(app)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {app}
                </button>
              ))}
              {/* Plus button + popover */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowAppPopover((v) => !v)}
                  className="flex items-center justify-center size-7 rounded-full border border-dashed border-border bg-background text-foreground hover:bg-muted transition-colors"
                  aria-label="Add more apps"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                {showAppPopover && (
                  <>
                    {/* Backdrop to close on outside click */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setShowAppPopover(false);
                        setAppSearch("");
                      }}
                    />
                    <div className="absolute left-0 top-full mt-2 z-50 w-64 rounded-lg border border-border bg-background shadow-lg p-2">
                      <Input
                        autoFocus
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        placeholder="Search apps..."
                        className="mb-2"
                      />
                      <div className="max-h-56 overflow-y-auto flex flex-col gap-1">
                        {MORE_APPS.filter((a) =>
                          a.toLowerCase().includes(appSearch.toLowerCase())
                        ).length === 0 ? (
                          <p className="text-xs text-muted-foreground px-2 py-3 text-center">
                            No apps found
                          </p>
                        ) : (
                          MORE_APPS.filter((a) =>
                            a.toLowerCase().includes(appSearch.toLowerCase())
                          ).map((app) => (
                            <button
                              key={app}
                              onClick={() => {
                                // Add to visible chips row
                                const nextAdded = new Set(addedApps);
                                nextAdded.add(app);
                                setAddedApps(nextAdded);
                                // Toggle selection for filtering
                                toggleApp(app);
                              }}
                              className={cn(
                                "flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-left transition-colors",
                                apps.has(app)
                                  ? "bg-muted text-foreground"
                                  : "hover:bg-muted text-foreground"
                              )}
                            >
                              <span>{app}</span>
                              {apps.has(app) && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Products Options */}
          {expandedFilters.has("product") && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-medium text-muted-foreground shrink-0">Product:</span>
              {PRODUCTS.map((p) => (
                <button
                  key={p}
                  onClick={() => toggleProduct(p)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    (p === "All" ? products.size === 0 : products.has(p))
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          {showMyTemplates
            ? `My Templates (${filtered.length})`
            : search || useCases.size > 0 || apps.size > 0 || products.size > 0
            ? `Results (${filtered.length})`
            : `Templates (${filtered.length})`}
        </h2>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchIcon className="size-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No templates match your search</p>
            <button
              onClick={() => {
                setSearch("");
                setUseCases(new Set());
                setApps(new Set());
                setProducts(new Set());
              }}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onClick={() => handleOpenTemplate(t.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-8 flex items-center justify-center gap-1">
        <Button variant="outline" size="icon" className="size-8">
          <ChevronDown className="size-4 rotate-90" />
        </Button>
        <Button variant="secondary" size="sm" className="h-8 w-8 p-0 text-xs">
          1
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-xs">
          2
        </Button>
        <Button variant="outline" size="icon" className="size-8">
          <ChevronDown className="size-4 -rotate-90" />
        </Button>
      </div>
    </div>
  );
}
