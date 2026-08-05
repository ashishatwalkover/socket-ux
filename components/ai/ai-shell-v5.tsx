"use client";

import { useEffect, useRef, useState } from "react";
import { AiVersionNav } from "./ai-version-nav";

// Version 5 — a fresh "starting point" canvas. Combines the trigger picker with
// an AI composer (create / import / transform) and quick-start suggestion chips.
// Intentionally self-contained so it can evolve independently of the other shells.

const SUGGESTIONS: { id: string; label: string; icon: React.ReactNode }[] = [
  {
    id: "slack-lead",
    label: "Send Slack on new lead",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path fill="#36C5F0" d="M9 3.5A1.75 1.75 0 1 0 9 7h1.75V5.25A1.75 1.75 0 0 0 9 3.5z" />
        <path fill="#2EB67D" d="M20.5 9A1.75 1.75 0 1 0 17 9v1.75h1.75A1.75 1.75 0 0 0 20.5 9z" />
        <path fill="#ECB22E" d="M15 20.5A1.75 1.75 0 1 0 15 17h-1.75v1.75A1.75 1.75 0 0 0 15 20.5z" />
        <path fill="#E01E5A" d="M3.5 15A1.75 1.75 0 1 0 7 15v-1.75H5.25A1.75 1.75 0 0 0 3.5 15z" />
      </svg>
    ),
  },
  {
    id: "sheets-notion",
    label: "Sync Sheets -> Notion",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    id: "email-digest",
    label: "Daily email digest",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 5L2 7" />
      </svg>
    ),
  },
];

// Simple branded tile for apps that don't need a bespoke glyph.
const tile = (bg: string, letter: string, fg = "#fff") => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" fill={bg} />
    <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="700" fill={fg} fontFamily="system-ui, sans-serif">
      {letter}
    </text>
  </svg>
);

// Reusable app icons — a trigger references one of these plus a specific event name.
const APP_ICONS: Record<string, React.ReactNode> = {
  slack: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#36C5F0" d="M9 3.5A1.75 1.75 0 1 0 9 7h1.75V5.25A1.75 1.75 0 0 0 9 3.5z" />
      <path fill="#2EB67D" d="M20.5 9A1.75 1.75 0 1 0 17 9v1.75h1.75A1.75 1.75 0 0 0 20.5 9z" />
      <path fill="#ECB22E" d="M15 20.5A1.75 1.75 0 1 0 15 17h-1.75v1.75A1.75 1.75 0 0 0 15 20.5z" />
      <path fill="#E01E5A" d="M3.5 15A1.75 1.75 0 1 0 7 15v-1.75H5.25A1.75 1.75 0 0 0 3.5 15z" />
    </svg>
  ),
  sheets: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#0F9D58" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <path fill="#fff" d="M8 12h8v6H8v-6zm1.4 1.4v1.1h2.1v-1.1H9.4zm3.2 0v1.1h1.9v-1.1h-1.9zm-3.2 2.1v1.1h2.1v-1.1H9.4zm3.2 0v1.1h1.9v-1.1h-1.9z" />
    </svg>
  ),
  gmail: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path fill="#4285F4" d="M4 6.5v11A1.5 1.5 0 0 0 5.5 19H8V9.5l4 3 4-3V19h2.5A1.5 1.5 0 0 0 20 17.5v-11L12 12 4 6.5z" />
      <path fill="#EA4335" d="M4 6.5 12 12 20 6.5A1.5 1.5 0 0 0 18.5 5h-13A1.5 1.5 0 0 0 4 6.5z" />
    </svg>
  ),
  notion: (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="3" y="2.5" width="18" height="19" rx="2.5" fill="#111" />
      <path fill="#fff" d="M8 7v10l1.8-.2V10l4.4 6.6 2-.3V7l-1.8.2v6.4L9.9 7.1 8 7z" />
    </svg>
  ),
  airtable: tile("#FCB400", "A"),
  docs: tile("#4285F4", "D"),
  drive: tile("#1FA463", "▲", "#fff"),
  typeform: tile("#262627", "T"),
  stripe: tile("#635BFF", "S"),
  github: tile("#181717", "G"),
  discord: tile("#5865F2", "D"),
  webhook: tile("#6B7280", "{}"),
};

const TRIGGERS: { id: string; app: keyof typeof APP_ICONS; label: string }[] = [
  { id: "slack-message", app: "slack", label: "New Message on Slack" },
  { id: "slack-mention", app: "slack", label: "New Mention" },
  { id: "slack-channel", app: "slack", label: "New Message in Channels" },
  { id: "slack-thread", app: "slack", label: "New Thread Message" },
  { id: "sheets-row", app: "sheets", label: "Row Added or Updated" },
  { id: "sheets-poll", app: "sheets", label: "Poll data on a schedule" },
  { id: "gmail-received", app: "gmail", label: "New Email Received" },
  { id: "gmail-attachment", app: "gmail", label: "New Attachment" },
  { id: "airtable-record", app: "airtable", label: "Record Created or Updated" },
  { id: "airtable-new", app: "airtable", label: "New Records Appear" },
  { id: "typeform-response", app: "typeform", label: "New Form Response" },
  { id: "docs-created", app: "docs", label: "New Document Created" },
  { id: "drive-file", app: "drive", label: "New or Updated File in Folder" },
  { id: "notion-page", app: "notion", label: "New Page Created" },
  { id: "stripe-payment", app: "stripe", label: "New Payment Succeeded" },
  { id: "github-issue", app: "github", label: "New Issue Opened" },
  { id: "discord-message", app: "discord", label: "New Message in Server" },
  { id: "webhook-request", app: "webhook", label: "Incoming Webhook Request" },
];

const ACTIONS: { id: string; app: keyof typeof APP_ICONS; label: string }[] = [
  { id: "slack-send-channel", app: "slack", label: "Send Channel Message" },
  { id: "slack-send-dm", app: "slack", label: "Send Direct Message" },
  { id: "gmail-send", app: "gmail", label: "Send Email" },
  { id: "gmail-draft", app: "gmail", label: "Create Draft" },
  { id: "sheets-add-row", app: "sheets", label: "Add Row" },
  { id: "sheets-update-row", app: "sheets", label: "Update Row" },
  { id: "notion-create-page", app: "notion", label: "Create Page" },
  { id: "airtable-create", app: "airtable", label: "Create Record" },
  { id: "docs-create", app: "docs", label: "Create Document" },
  { id: "discord-send", app: "discord", label: "Send Message" },
  { id: "stripe-customer", app: "stripe", label: "Create Customer" },
  { id: "webhook-send", app: "webhook", label: "Send HTTP Request" },
];

type Step = { key: string; kind: "trigger" | "action"; app: keyof typeof APP_ICONS; label: string };

/** A workflow node card — the selected trigger/action shown as a builder step. */
function StepCard({ step, meta }: { step: Step; meta?: string }) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-neutral-50 px-4 py-2.5">
        <span className="text-[15px] font-semibold text-neutral-800">
          {step.kind === "trigger" ? "Trigger" : "Action"}
        </span>
        {meta && (
          <span className="rounded-full bg-neutral-200/70 px-3 py-0.5 text-[13px] font-medium text-neutral-600">
            {meta}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2.5 text-neutral-400">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white">
          {APP_ICONS[step.app]}
        </span>
        <span className="text-[17px] text-neutral-800">{step.label}</span>
      </div>
    </div>
  );
}

/** Small vertical connector between two stacked step cards. */
function StepConnector({ centered }: { centered?: boolean }) {
  return (
    <div className={centered ? "flex justify-center" : "flex justify-start pl-[88px]"}>
      <div className="h-6 w-px bg-neutral-300" />
    </div>
  );
}

// Suggested templates shown after submitting the AI prompt.
// Design mirrors the Templates v4 page card (app/app/templates/v4/page.tsx):
// a color-tinted card with a workflow-preview panel, white app-icon tiles, chips and installs.
type Tint = { bg: string; border: string; dark: boolean };
const SUGGESTED_TEMPLATES: {
  id: string;
  title: string;
  apps: (keyof typeof APP_ICONS)[];
  installs: number;
  chips: string[];
  tint: Tint;
}[] = [
  { id: "st1", title: "Notify Slack when a new lead is added", apps: ["sheets", "slack"], installs: 1240, chips: ["Sales", "Slack"], tint: { bg: "#2E6BE6", border: "#2A5FCC", dark: true } },
  { id: "st2", title: "Save Gmail attachments to Google Drive", apps: ["gmail", "drive"], installs: 980, chips: ["Productivity"], tint: { bg: "#2FA36B", border: "#288F5E", dark: true } },
  { id: "st3", title: "Sync new form responses to a sheet", apps: ["typeform", "sheets"], installs: 760, chips: ["Forms", "Data"], tint: { bg: "#FFFFFF", border: "#D1D5DB", dark: false } },
  { id: "st4", title: "Send a daily digest email from new records", apps: ["airtable", "gmail"], installs: 540, chips: ["Reporting"], tint: { bg: "#6366F1", border: "#5457E5", dark: true } },
];

const formatInstalls = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

// Same preview media pool as the Templates v4 page (app/app/templates/v4/page.tsx).
const FIRST_SLIDE_IMAGES = [
  "https://files.msg91.com/92283/yemeyeki/aexoumol.png",
  "https://files.msg91.com/92283/yemeyeki/fryargow.png",
  "https://files.msg91.com/92283/yemeyeki/wbcfjbcv.png",
];
const REST_SLIDE_IMAGES = [
  "https://files.msg91.com/92283/yemeyeki/stamfhto.png",
  "https://files.msg91.com/92283/yemeyeki/sszhzabe.webp",
  "https://files.msg91.com/92283/yemeyeki/ezxwefnu.webp",
  "https://files.msg91.com/92283/yemeyeki/kyopytlf.webp",
  "https://files.msg91.com/92283/yemeyeki/umtkbzqi.webp",
  "https://files.msg91.com/92283/yemeyeki/nhcjlaqj.webp",
  "https://files.msg91.com/92283/yemeyeki/yyexeirl.webp",
  "https://files.msg91.com/92283/yemeyeki/dsfzlnfz.webp",
];
const SAMPLE_VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
];
const isVideoUrl = (url: string) => url.endsWith(".mp4");
function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}
function templatePreviewImages(id: string, count: number) {
  const first = FIRST_SLIDE_IMAGES[hashSeed(id) % FIRST_SLIDE_IMAGES.length];
  const rest = Array.from(
    { length: count - 1 },
    (_, i) => REST_SLIDE_IMAGES[hashSeed(`${id}-${i}`) % REST_SLIDE_IMAGES.length]
  );
  const media = [first, ...rest];
  // every other template also gets a sample walkthrough video as its first slide
  if (hashSeed(id) % 2 === 0) {
    media.unshift(SAMPLE_VIDEOS[hashSeed(`${id}-video`) % SAMPLE_VIDEOS.length]);
  }
  return media;
}

function TemplateCard({ t }: { t: (typeof SUGGESTED_TEMPLATES)[number] }) {
  const { dark } = t.tint;
  const images = templatePreviewImages(t.id, 4);
  const [idx, setIdx] = useState(0);
  const active = images[idx] ?? images[0];

  return (
    <div
      role="button"
      tabIndex={0}
      style={{ backgroundColor: t.tint.bg, borderColor: t.tint.border }}
      className="group/info flex w-[300px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-all hover:shadow-lg"
    >
      {/* Preview media (images + occasional video), same pool as v4 */}
      <div className="bg-gray-100">
        <div className="group/media relative h-44 w-full">
          {isVideoUrl(active) ? (
            <video src={active} muted loop autoPlay playsInline className="h-full w-full object-cover" />
          ) : (
            <img src={active} alt="Template preview" className="h-full w-full object-cover" />
          )}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity hover:bg-white group-hover/media:opacity-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx((i) => (i + 1) % images.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity hover:bg-white group-hover/media:opacity-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail filmstrip */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 border-b border-t border-gray-200 bg-gray-50 p-2">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                  i === idx ? "border-gray-900" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {isVideoUrl(img) ? (
                  <>
                    <video src={img} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </>
                ) : (
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="relative flex flex-1 flex-col p-6">
        <h3 className={`mb-4 text-xl font-bold leading-tight ${dark ? "text-white" : "text-gray-900"}`}>
          {t.title}
        </h3>

        <div className="mb-6 flex items-center gap-2">
          {t.apps.map((app) => (
            <div key={app} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
              {APP_ICONS[app]}
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {t.chips.map((chip) => (
              <span
                key={chip}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                  dark ? "border-white/40 bg-white/20 text-white" : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
          <div className={`flex items-center gap-1 whitespace-nowrap text-sm ${dark ? "text-white/90" : "text-gray-600"}`}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="font-medium">{formatInstalls(t.installs)}</span>
            <span>installs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The "Let AI do it" option — heading, composer and quick-start chips.
    Submitting hands the prompt to the shell, which switches into chat mode. */
function AiComposerBlock({
  draft,
  setDraft,
  onSubmit,
}: {
  draft: string;
  setDraft: (v: string) => void;
  onSubmit: (text: string) => void;
}) {
  const hasText = draft.trim().length > 0;
  const submit = () => {
    if (hasText) onSubmit(draft);
  };

  return (
    <>
      {/* or divider */}
      <div className="my-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-sm font-semibold uppercase tracking-wide text-neutral-500 shadow-sm">
          or
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        Let AI do it
      </h2>
      <p className="mt-2 text-[15px] text-neutral-500">
        Describe your idea, import an existing flow, or paste a workflow.
      </p>

      {/* AI composer */}
      <div className="mt-5 rounded-2xl border-2 border-blue-500 bg-white text-left shadow-sm">
        <div className="flex gap-3 px-4 pt-4">
          <svg viewBox="0 0 24 24" width="20" height="20" className="mt-0.5 shrink-0 text-blue-500" fill="currentColor" aria-hidden="true">
            <path d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2z" />
            <path d="M19 14l.8 2.4L22 17l-2.2.7L19 20l-.8-2.3L16 17l2.2-.6L19 14z" />
          </svg>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={2}
            placeholder="Describe your automation, doodle your idea, import an existing one, or paste a workflow..."
            className="min-h-[52px] w-full resize-none bg-transparent text-[15px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>
        <div className="flex justify-end px-4 pb-3">
          <button
            type="button"
            aria-label="Submit"
            onClick={submit}
            disabled={!hasText}
            className={`transition-colors ${hasText ? "text-blue-600 hover:text-blue-700" : "cursor-not-allowed text-neutral-300"}`}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick-start chips */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setDraft(s.label)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            <span className="text-neutral-500">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </>
  );
}

type ChatMsg = { role: "user" | "assistant"; text: string; templates?: boolean };

/** Suggested template cards — full-bleed row, centered when they fit, scrolls when they don't. */
function TemplatesRow() {
  return (
    <div className="flex justify-center gap-4 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {SUGGESTED_TEMPLATES.map((t) => (
        <TemplateCard key={t.id} t={t} />
      ))}
    </div>
  );
}

/** Compact composer docked at the bottom of the chat view, with a v3-style utility footer below. */
function ChatComposer({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const hasText = text.trim().length > 0;
  const submit = () => {
    if (!hasText) return;
    onSubmit(text);
    setText("");
  };

  return (
    <div>
      <div className="flex items-end gap-2 rounded-2xl border-2 border-blue-500 bg-white px-4 py-2.5 shadow-sm">
        <svg viewBox="0 0 24 24" width="20" height="20" className="mb-1.5 shrink-0 text-blue-500" fill="currentColor" aria-hidden="true">
          <path d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2z" />
          <path d="M19 14l.8 2.4L22 17l-2.2.7L19 20l-.8-2.3L16 17l2.2-.6L19 14z" />
        </svg>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Reply, or describe another automation..."
          className="max-h-32 min-h-[28px] w-full resize-none bg-transparent py-1 text-[15px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
        />
        <button
          type="button"
          aria-label="Send"
          onClick={submit}
          disabled={!hasText}
          className={`mb-0.5 shrink-0 transition-colors ${hasText ? "text-blue-600 hover:text-blue-700" : "cursor-not-allowed text-neutral-300"}`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </div>

      {/* Utility footer — attach + mic on the left, links on the right (v3 style) */}
      <div className="mt-2 flex items-center gap-0.5 px-1">
        <button
          type="button"
          aria-label="Attach"
          className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Speak"
          className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        </button>

        <div className="ml-auto flex items-center gap-3 text-[11px]">
          <button
            type="button"
            className="text-gray-600 underline transition-colors hover:text-gray-800"
          >
            Hire an expert
          </button>
          <button
            type="button"
            className="text-gray-600 underline transition-colors hover:text-gray-800"
          >
            Build manually
          </button>
        </div>
      </div>
    </div>
  );
}

/** Chat mode — messages stack from the bottom, template rows are full-bleed,
    and the composer stays docked and centered. */
function ChatView({ chat, onSubmit }: { chat: ChatMsg[]; onSubmit: (text: string) => void }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-end gap-6 py-8">
          {chat.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="mx-auto w-full max-w-3xl px-6">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-2.5 text-[15px] text-white">
                    {m.text}
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="flex flex-col gap-4">
                <div className="mx-auto w-full max-w-3xl px-6">
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                        <path d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2z" />
                      </svg>
                    </span>
                    <p className="text-[15px] text-neutral-800">{m.text}</p>
                  </div>
                </div>
                {m.templates && <TemplatesRow />}
              </div>
            )
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto w-full max-w-3xl px-6 py-4">
          <ChatComposer onSubmit={onSubmit} />
        </div>
      </div>
    </main>
  );
}

/** Right-side panel for browsing and searching actions to add to the flow. */
function ActionPanel({
  onSelect,
  onClose,
}: {
  onSelect: (a: (typeof ACTIONS)[number]) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = q
    ? ACTIONS.filter((a) => a.label.toLowerCase().includes(q) || a.app.toLowerCase().includes(q))
    : ACTIONS;

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-neutral-200 bg-white sm:w-96">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <h3 className="text-[15px] font-semibold text-neutral-900">Add an action</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-neutral-400 transition-colors hover:text-neutral-700"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="border-b border-neutral-100 p-3">
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 focus-within:border-blue-400 focus-within:bg-white">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-400">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions..."
            className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {results.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-neutral-400">No actions found</p>
        ) : (
          results.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-neutral-50"
            >
              <span className="flex size-8 items-center justify-center rounded-md border border-neutral-200 bg-white">
                {APP_ICONS[a.app]}
              </span>
              <span className="text-[14px] font-medium text-neutral-800">{a.label}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

export function AiShellV5() {
  const [draft, setDraft] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const hasFlow = steps.length > 0;
  const hasAction = steps.some((s) => s.kind === "action");
  const chatActive = chat.length > 0;

  // Submitting the AI prompt switches into chat mode: append the user's message
  // and an assistant reply carrying the suggested templates.
  const submitAi = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setChat((prev) => [
      ...prev,
      { role: "user", text: t },
      {
        role: "assistant",
        text: "Templates that match your idea — choose one to save time, and customize it later if needed.",
        templates: true,
      },
    ]);
    setDraft("");
  };

  const selectTrigger = (t: (typeof TRIGGERS)[number]) =>
    setSteps([{ key: `trigger-${t.id}`, kind: "trigger", app: t.app, label: t.label }]);

  const addAction = (a: (typeof ACTIONS)[number]) => {
    setSteps((prev) => [...prev, { key: `action-${a.id}-${prev.length}`, kind: "action", app: a.app, label: a.label }]);
    setPanelOpen(false);
  };

  const reset = () => {
    setSteps([]);
    setPanelOpen(false);
  };

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-border/70 px-4 py-2">
        <AiVersionNav />
      </header>

      <div className="flex flex-1 overflow-hidden">
      {chatActive ? (
        <ChatView chat={chat} onSubmit={submitAi} />
      ) : (
      <>
      <main className="flex flex-1 flex-col justify-center overflow-y-auto py-12">
        {!hasFlow ? (
          <>
            <div className="w-full max-w-3xl px-6 text-left sm:px-16">
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                What do you want to automate today?
              </h1>
              <p className="mt-2 text-[15px] text-neutral-500">
                Build it yourself — start by choosing a trigger that kicks off your automation.
              </p>
            </div>

            {/* Add Trigger + suggested trigger apps — full-bleed, horizontally scrollable row */}
            <div className="mt-8 flex items-stretch gap-3 overflow-x-auto pl-6 pr-6 sm:pl-16 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                className="flex shrink-0 items-center gap-3 rounded-xl border-2 border-dashed border-blue-400 bg-white px-5 py-4 text-left transition-colors hover:bg-blue-50/50"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-500">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="whitespace-nowrap text-[15px] font-medium text-neutral-800">Add Trigger</span>
              </button>

              {TRIGGERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.label}
                  onClick={() => selectTrigger(t)}
                  className="flex shrink-0 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <span className="shrink-0">{APP_ICONS[t.app]}</span>
                  <span className="whitespace-nowrap text-[14px] font-medium text-neutral-800">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="w-full max-w-3xl px-6 text-left sm:px-16">
              <AiComposerBlock draft={draft} setDraft={setDraft} onSubmit={submitAi} />
            </div>
          </>
        ) : (
          <>
            {/* Builder view — trigger selected, now chain actions */}
            <div className={`w-full max-w-3xl px-6 sm:px-16 ${hasAction ? "mx-auto flex flex-col items-center text-center" : "text-left"}`}>
              {hasAction ? (
                <>
                  <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                    Build your automation
                  </h1>
                  <p className="mt-2 text-[15px] text-neutral-500">
                    Your trigger is set. Add an action to run whenever it fires.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-4 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
                  >
                    Start over
                  </button>
                </>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                      Build your automation
                    </h1>
                    <p className="mt-2 text-[15px] text-neutral-500">
                      Your trigger is set. Add an action to run whenever it fires.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-1 shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
                  >
                    Start over
                  </button>
                </div>
              )}

              {/* Step cards */}
              <div className={`mt-8 ${hasAction ? "flex w-full flex-col items-center" : ""}`}>
                {steps.map((step, i) => (
                  <div key={step.key}>
                    {i > 0 && <StepConnector centered={hasAction} />}
                    <StepCard step={step} meta={step.kind === "trigger" ? "every 5 minutes" : undefined} />
                  </div>
                ))}
                <StepConnector centered={hasAction} />
              </div>
            </div>

            {/* Choose action heading — hidden once an action has been chosen */}
            {!hasAction && (
              <div className="w-full max-w-3xl px-6 text-left sm:px-16">
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                  Choose an action
                </h2>
                <p className="mt-2 text-[15px] text-neutral-500">
                  Pick what should happen next in your automation.
                </p>
              </div>
            )}

            {/* Actions — horizontally scrollable row; full-bleed before an action is chosen, centered after. */}
            <div className={`mt-8 flex items-stretch gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${hasAction ? "justify-center px-6" : "pl-6 pr-6 sm:pl-16"}`}>
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="flex shrink-0 items-center gap-3 rounded-xl border-2 border-dashed border-blue-400 bg-white px-5 py-4 text-left transition-colors hover:bg-blue-50/50"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-500">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="whitespace-nowrap text-[15px] font-medium text-neutral-800">Add Action</span>
              </button>

              {!hasAction &&
                ACTIONS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    title={a.label}
                    onClick={() => addAction(a)}
                    className="flex shrink-0 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                  >
                    <span className="shrink-0">{APP_ICONS[a.app]}</span>
                    <span className="whitespace-nowrap text-[14px] font-medium text-neutral-800">{a.label}</span>
                  </button>
                ))}
            </div>

            {/* AI option stays available until an action is chosen */}
            {!hasAction && (
              <div className="w-full max-w-3xl px-6 text-left sm:px-16">
                <AiComposerBlock draft={draft} setDraft={setDraft} onSubmit={submitAi} />
              </div>
            )}
          </>
        )}
      </main>

      {panelOpen && <ActionPanel onSelect={addAction} onClose={() => setPanelOpen(false)} />}
      </>
      )}
      </div>
    </div>
  );
}
