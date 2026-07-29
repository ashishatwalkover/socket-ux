"use client";

import { useState } from "react";

/* Configuration mini-app rendered in Version 4's right panel.
   Four tabs: Home (overview), Destinations, Notification Content, Airtable Logging. */

const LOGO = {
  sheets: "https://stuff.thingsofbrand.com/google.com/images/img4_googlesheet.png",
  slack: "https://stuff.thingsofbrand.com/slack.com/images/img668216333e_slack.jpg",
  gmail: "https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png",
  airtable:
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%3E%3Crect%20x='3'%20y='3'%20width='8'%20height='8'%20rx='1.5'%20fill='%23FCB400'/%3E%3Crect%20x='13'%20y='3'%20width='8'%20height='8'%20rx='1.5'%20fill='%2318BFFF'/%3E%3Crect%20x='3'%20y='13'%20width='18'%20height='8'%20rx='1.5'%20fill='%23F82B60'/%3E%3C/svg%3E",
};

type Tab = "home" | "destinations" | "destinations2" | "content1" | "content2" | "airtable";

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "destinations", label: "Destinations" },
  { id: "destinations2", label: "Destinations 2" },
  { id: "content1", label: "Notification Content 1" },
  { id: "content2", label: "Notification Content 2" },
  { id: "airtable", label: "Airtable Logging" },
];

function Logo({ src }: { src: string }) {
  return <img src={src} alt="" className="size-5 shrink-0 object-contain" />;
}

const DragHandle = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-400 shrink-0">
    <line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="16" x2="20" y2="16" />
  </svg>
);

const Pencil = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);
const CheckMark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6L9 17l-5-5" /></svg>
);
const XMark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6L6 18M6 6l12 12" /></svg>
);

/* A value that reveals a pencil on row hover and turns into an editable
   input (single-line) or textarea (multiline). Clicking the pencil OR the
   value text enters edit mode. `truncate` keeps the display to one line. */
function EditableValue({ initial, multiline = false, truncate = false }: { initial: string; multiline?: boolean; truncate?: boolean }) {
  const [value, setValue] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);

  const save = () => {
    setValue(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };
  const startEdit = () => {
    setDraft(value);
    setEditing(true);
  };

  if (editing) {
    return (
      <div className="flex flex-1 items-start gap-2">
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && cancel()}
            rows={4}
            className="flex-1 resize-y rounded-md border border-violet-300 px-2.5 py-1.5 text-sm outline-none focus:border-violet-500"
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                save();
              }
              if (e.key === "Escape") cancel();
            }}
            className="flex-1 rounded-md border border-violet-300 px-2.5 py-1 text-sm outline-none focus:border-violet-500"
          />
        )}
        <button onClick={save} title="Save" className="mt-0.5 text-emerald-600 hover:text-emerald-700"><CheckMark /></button>
        <button onClick={cancel} title="Cancel" className="mt-0.5 text-slate-400 hover:text-slate-600"><XMark /></button>
      </div>
    );
  }

  return (
    <span className="flex min-w-0 flex-1 items-start gap-2 text-sm text-slate-600">
      <span
        onClick={startEdit}
        title="Click to edit"
        className={`min-w-0 cursor-text rounded hover:bg-slate-50 ${truncate ? "flex-1 truncate" : "break-words"}`}
      >
        {value}
      </span>
      <button
        onClick={startEdit}
        title="Edit"
        className="shrink-0 text-slate-400 opacity-0 transition-opacity hover:text-violet-600 group-hover:opacity-100"
      >
        <Pencil />
      </button>
    </span>
  );
}

export function MiniAppConfig() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="h-full w-full bg-[#f5f5f5] p-6 text-slate-900">
      <div className="flex w-full max-w-[1000px] overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Sub-nav */}
        <nav className="w-64 shrink-0 border-r border-slate-200 p-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                tab === t.id ? "bg-slate-100 font-medium text-slate-900" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{t.label}</span>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-slate-400">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "home" && <HomeTab />}
          {tab === "destinations" && <DestinationsTab variant="inline" />}
          {tab === "destinations2" && <DestinationsTab variant="stacked" />}
          {tab === "content1" && <ContentTab variant="inline" />}
          {tab === "content2" && <ContentTab variant="stacked" />}
          {tab === "airtable" && <AirtableTab />}
        </div>
      </div>
    </div>
  );
}

function HomeTab() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
          <Logo src={LOGO.sheets} />
        </span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        <Logo src={LOGO.airtable} />
        <Logo src={LOGO.gmail} />
        <Logo src={LOGO.slack} />
      </div>
      <h2 className="mt-4 text-xl font-semibold">Google Sheets lead alerts to Slack, Gmail, and Airtable</h2>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
        <li>Trigger when a row is added or updated in Google Sheets.</li>
        <li>Read the lead details from the sheet.</li>
        <li>Send a Slack notification to the selected channel.</li>
        <li>Send an email notification to <b>ashish@walkover.in</b>.</li>
        <li>Create a generic Airtable record in the selected table.</li>
      </ol>
      <p className="mt-4 text-sm text-slate-600">
        <b>Note:</b> The current Airtable table does not contain dedicated columns for name, phone, email, or row number, so the Airtable step stores a generic record rather than full structured lead data.
      </p>
    </div>
  );
}

/* A "Using Connection *" row. Inline: label left, connection box right.
   Stacked: label on top, connection box below. */
function ConnectionRow({ label, chipLogo, chipValue, variant }: { label: string; chipLogo: string; chipValue: string; variant: "inline" | "stacked" }) {
  const box = (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
      <span className="text-sm text-slate-400">Using Connection <span className="text-red-400">*</span></span>
      <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
        <img src={chipLogo} alt="" className="size-4 object-contain" />
        {chipValue}
      </span>
      <span className="text-xs font-medium tracking-wide text-slate-300">ADD TITLE</span>
    </div>
  );
  if (variant === "stacked") {
    return (
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Logo src={chipLogo} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="mt-1.5 pl-6">{box}</div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 px-4 py-4">
      <div className="flex w-40 shrink-0 items-center gap-2">
        <Logo src={chipLogo} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex-1">{box}</div>
    </div>
  );
}

/* A simple label / editable-value row, inline or stacked. */
function ValueRow({ logo, label, value, variant }: { logo: string; label: string; value: string; variant: "inline" | "stacked" }) {
  if (variant === "stacked") {
    return (
      <div className="group px-4 py-4">
        <div className="flex items-center gap-2">
          <Logo src={logo} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="mt-1.5 pl-6">
          <EditableValue initial={value} />
        </div>
      </div>
    );
  }
  return (
    <div className="group flex items-center gap-4 px-4 py-4">
      <div className="flex w-40 shrink-0 items-center gap-2">
        <Logo src={logo} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <EditableValue initial={value} />
    </div>
  );
}

function DestinationsTab({ variant }: { variant: "inline" | "stacked" }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Destinations {variant === "stacked" ? "2" : ""}</h2>
      <p className="mt-1 text-sm text-slate-500">Choose who receives notifications and where alerts are logged.</p>
      <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
        <ConnectionRow label="Slack Workspace" chipLogo={LOGO.slack} chipValue="flow-viasocket" variant={variant} />
        <ConnectionRow label="Gmail Account" chipLogo={LOGO.gmail} chipValue="ashish@walkover.in" variant={variant} />
        <ConnectionRow label="Airtable Account" chipLogo={LOGO.airtable} chipValue="ashish@walkover.in" variant={variant} />
        <ValueRow logo={LOGO.slack} label="Slack Channel" value="flow-test" variant={variant} />
        <ValueRow logo={LOGO.gmail} label="Email Recipient" value="ashish@walkover.in" variant={variant} />
      </div>
    </div>
  );
}

/* Template row — two layout approaches:
   - inline:  label and value on a single line (value truncated)
   - stacked: label on top, value below the heading */
function TemplateRow({ label, value, variant }: { label: string; value: string; variant: "inline" | "stacked" }) {
  if (variant === "stacked") {
    return (
      <div className="group px-4 py-4">
        <div className="flex items-center gap-2">
          <DragHandle />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="mt-1.5 pl-6">
          <EditableValue initial={value} multiline />
        </div>
      </div>
    );
  }
  return (
    <div className="group flex items-center gap-3 px-4 py-4">
      <DragHandle />
      <span className="w-44 shrink-0 text-sm font-medium">{label}</span>
      <EditableValue initial={value} multiline truncate />
    </div>
  );
}

const TEMPLATE_ROWS = [
  {
    label: "Slack Message Template",
    value: "*New lead added in Google Sheets* *Name:* ${name} *Number:* ${number} *Email:* ${email} *Row:* ${row_number}",
  },
  { label: "Email Subject", value: "New Lead Notification from Google Sheets" },
  {
    label: "Email Body Template",
    value: "<p>A new lead has been added or updated in Google Sheets.</p><p><b>Name:</b> ${name}<br/><b>Phone:</b> ${number}<br/><b>Email:</b> ${email}<br/><b>Row:</b> ${row_number}</p><p>Change type: ${change_type}</p>",
  },
];

function ContentTab({ variant }: { variant: "inline" | "stacked" }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">
        Notification Content {variant === "inline" ? "1" : "2"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {variant === "inline"
          ? "Single-line view — each template shows its value on one line."
          : "Stacked view — each value appears below its heading."}
      </p>
      <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
        {TEMPLATE_ROWS.map((r) => (
          <TemplateRow key={r.label} label={r.label} value={r.value} variant={variant} />
        ))}
      </div>
    </div>
  );
}

function AirtableTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Airtable Logging</h2>
      <p className="mt-1 text-sm text-slate-500">Configure where the new lead alert should be logged in Airtable.</p>
      <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
        <ValueRow logo={LOGO.airtable} label="Airtable Base" value="Untitled App" variant="inline" />
        <div className="group flex items-center gap-4 px-4 py-4">
          <div className="flex w-40 shrink-0 items-center gap-2">
            <DragHandle />
            <span className="text-sm font-medium">Airtable Table</span>
          </div>
          <EditableValue initial="Emplooyee" />
        </div>
      </div>
    </div>
  );
}
