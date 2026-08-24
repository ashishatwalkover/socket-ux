"use client";

import { useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { cn } from "@/lib/utils";
import { EmbedIntegrationsPreview } from "./embed-preview";

/* ─── Small inline icons ─── */
const CloseIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const ExpandIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
);

/* ─────────────────────────── Types & constants ─────────────────────────── */

type PositionKey = "full" | "left" | "right" | "popover" | "popup";

type ToggleKey =
  | "showEnabledFlows"
  | "hideAdvancedFlow"
  | "showAskAi"
  | "hideCustomLogic"
  | "hideCustomApi"
  | "hideWebhook";

const TOGGLES: { key: ToggleKey; label: string; help: string }[] = [
  {
    key: "showEnabledFlows",
    label: "Show enabled flows",
    help: "Surface flows the user has already turned on when the embed opens.",
  },
  {
    key: "hideAdvancedFlow",
    label: "Hide “switch to advanced flow” button",
    help: "Keep users in the guided builder by removing the advanced-mode switch.",
  },
  {
    key: "showAskAi",
    label: "Show “Ask AI to build a flow”",
    help: "Let users describe an automation in plain language and let AI draft it.",
  },
  {
    key: "hideCustomLogic",
    label: "Hide custom logic on home",
    help: "Remove the code / custom-logic entry point from the embed home screen.",
  },
  {
    key: "hideCustomApi",
    label: "Hide custom API on home",
    help: "Remove the “call a custom API” option from the embed home screen.",
  },
  {
    key: "hideWebhook",
    label: "Hide webhook on home",
    help: "Remove the webhook trigger option from the embed home screen.",
  },
];

/* Mini layout diagrams — the frame is the host page, the accent is the embed. */
function PositionGlyph({ variant, active }: { variant: PositionKey; active: boolean }) {
  const frame = active ? "#171717" : "#d4d4d4";
  const fill = active ? "#171717" : "#a3a3a3";
  const faint = active ? "rgba(23,23,23,0.12)" : "#f5f5f5";
  return (
    <svg viewBox="0 0 72 48" width="72" height="48" fill="none">
      <rect x="1" y="1" width="70" height="46" rx="5" stroke={frame} strokeWidth="1.5" fill={faint} />
      {variant === "full" && <rect x="7" y="7" width="58" height="34" rx="3" fill={fill} />}
      {variant === "left" && <rect x="7" y="7" width="24" height="34" rx="3" fill={fill} />}
      {variant === "right" && <rect x="41" y="7" width="24" height="34" rx="3" fill={fill} />}
      {variant === "popover" && (
        <>
          <rect x="7" y="7" width="58" height="34" rx="3" fill={active ? "rgba(23,23,23,0.18)" : "#e5e5e5"} />
          <rect x="20" y="13" width="32" height="22" rx="3" fill={fill} />
        </>
      )}
      {variant === "popup" && (
        <>
          <rect x="7" y="7" width="58" height="34" rx="3" fill={active ? "rgba(23,23,23,0.18)" : "#e5e5e5"} />
          <rect x="26" y="16" width="20" height="16" rx="3" fill={fill} />
        </>
      )}
    </svg>
  );
}

const POSITIONS: { key: PositionKey; label: string; desc: string }[] = [
  { key: "full", label: "All available space", desc: "Fills the parent container." },
  { key: "left", label: "Left slider", desc: "Slides in from the left edge." },
  { key: "right", label: "Right slider", desc: "Slides in from the right edge." },
  { key: "popover", label: "Pop over", desc: "Floats above your page content." },
  { key: "popup", label: "Popup", desc: "A compact centered modal." },
];

/* Which dimensions each position actually respects. */
const DIM_RULES: Record<PositionKey, { height: boolean; width: boolean }> = {
  full: { height: false, width: false },
  left: { height: false, width: true },
  right: { height: false, width: true },
  popover: { height: true, width: true },
  popup: { height: true, width: true },
};

/* ─────────────────────────────── Section shell ─────────────────────────── */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ borderColor: "divider", borderRadius: 2 }}>
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </Paper>
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-800">
      {children}
      {hint && <span className="ml-1 font-normal text-gray-400">{hint}</span>}
    </label>
  );
}

/* ─────────────────────────────── Live preview ──────────────────────────── */

function Preview({
  title,
  subtitle,
  position,
  large = false,
}: {
  title: string;
  subtitle: string;
  position: PositionKey;
  large?: boolean;
}) {
  const t = title.trim() || "Integrations";
  const s = subtitle.trim() || "Connect your favorite apps in a few clicks.";

  // Small preview shows a lightweight skeleton; the full-size preview renders
  // the actual integrations prototype.
  const skeleton = (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <div className="text-[11px] font-semibold text-gray-900">{t}</div>
      <div className="text-[9px] leading-snug text-gray-400 line-clamp-2">{s}</div>
      <div className="mt-1 grid grid-cols-3 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex h-5 items-center justify-center rounded bg-gray-100">
            <span className="size-2 rounded-full bg-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );

  const content = large ? <EmbedIntegrationsPreview title={t} subtitle={s} /> : skeleton;
  const sliderW = large ? "w-[42%]" : "w-2/5";
  const pad = large ? "" : "p-2";

  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50", large ? "h-[74vh]" : "h-56")}>
      {/* fake browser chrome */}
      <div className="flex shrink-0 items-center gap-1 border-b border-gray-200 bg-white px-2.5 py-1.5">
        <span className="size-1.5 rounded-full bg-gray-300" />
        <span className="size-1.5 rounded-full bg-gray-300" />
        <span className="size-1.5 rounded-full bg-gray-300" />
        <span className="ml-2 h-2.5 flex-1 rounded-full bg-gray-100" />
      </div>

      <div className="relative min-h-0 flex-1">
        {position === "full" && <div className={cn("h-full", large ? "" : "p-3")}>{content}</div>}

        {position === "left" && (
          <div className="flex h-full">
            <div className={cn("border-r border-gray-200 bg-white", sliderW, pad)}>{content}</div>
            <div className="flex-1 bg-gray-50" />
          </div>
        )}

        {position === "right" && (
          <div className="flex h-full">
            <div className="flex-1 bg-gray-50" />
            <div className={cn("border-l border-gray-200 bg-white", sliderW, pad)}>{content}</div>
          </div>
        )}

        {(position === "popover" || position === "popup") && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-4">
            <div
              className={cn(
                "overflow-hidden rounded-lg bg-white shadow-xl",
                position === "popup" ? (large ? "h-[70%] w-1/2" : "w-1/2") : large ? "h-[85%] w-3/5" : "w-3/5"
              )}
            >
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────── Main panel ────────────────────────────── */

export function Configuration() {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    showEnabledFlows: true,
    hideAdvancedFlow: true,
    showAskAi: false,
    hideCustomLogic: false,
    hideCustomApi: false,
    hideWebhook: false,
  });
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [helpLink, setHelpLink] = useState("");
  const [helpTitle, setHelpTitle] = useState("");
  const [domains, setDomains] = useState<string[]>([]);
  const [domainDraft, setDomainDraft] = useState("");
  const [position, setPosition] = useState<PositionKey>("full");
  const [height, setHeight] = useState("100");
  const [width, setWidth] = useState("100");
  const [heightUnit, setHeightUnit] = useState("%");
  const [widthUnit, setWidthUnit] = useState("%");
  const [previewOpen, setPreviewOpen] = useState(false);

  const addDomain = () => {
    const d = domainDraft.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (d && !domains.includes(d)) setDomains((prev) => [...prev, d]);
    setDomainDraft("");
  };

  const dims = DIM_RULES[position];

  // Preview sizing — honor the configured dimensions, with sensible fallbacks
  // when they are still at the "100%" default (which would fill the screen).
  const pvTitle = title.trim() || "Integrations";
  const pvSubtitle = subtitle.trim() || "Connect your favorite apps in a few clicks.";
  const widthVal = width.trim();
  const heightVal = height.trim();
  const isDefaultWidth = !widthVal || (widthUnit === "%" && widthVal === "100");
  const isDefaultHeight = !heightVal || (heightUnit === "%" && heightVal === "100");
  const sliderWidth = isDefaultWidth ? "min(480px, 92vw)" : `${widthVal}${widthUnit}`;
  const modalHeight = isDefaultHeight ? undefined : `${heightVal}${heightUnit}`;
  const modalWidth = isDefaultWidth ? undefined : `${widthVal}${widthUnit}`;

  const previewShell = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Preview</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
            {POSITIONS.find((p) => p.key === position)?.label}
          </span>
        </div>
        <IconButton onClick={() => setPreviewOpen(false)} size="small" aria-label="Close preview">
          <CloseIcon />
        </IconButton>
      </div>
      <div className="min-h-0 flex-1">
        <EmbedIntegrationsPreview title={pvTitle} subtitle={pvSubtitle} />
      </div>
    </div>
  );

  const unitSelect = (value: string, onChange: (v: string) => void) => (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      sx={{ width: 74, "& .MuiSelect-select": { py: "8.5px" } }}
    >
      <MenuItem value="%">%</MenuItem>
      <MenuItem value="px">px</MenuItem>
      <MenuItem value="vh">vh</MenuItem>
    </Select>
  );

  return (
    <div className="mx-auto max-w-6xl">
      {/* Sticky action header */}
      <div className="sticky top-0 z-10 -mx-10 -mt-8 mb-6 border-b border-gray-200 bg-white/85 px-10 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Control what the embed shows and how it appears inside your product.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="contained">Save changes</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ── Form column ── */}
        <div className="flex flex-col gap-6">
          <Section
            title="Display position"
            description="Pick how the embed is presented on your page."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {POSITIONS.map((p) => {
                const active = position === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPosition(p.key)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all",
                      active
                        ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <PositionGlyph variant={p.key} active={active} />
                    <div>
                      <p className={cn("text-sm font-medium", active ? "text-gray-900" : "text-gray-700")}>
                        {p.label}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section
            title="Dimensions"
            description={
              position === "full"
                ? "The embed fills its container, so no size is needed."
                : "Set the size of the embed for the selected position."
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>
                  Height
                  {!dims.height && <span className="ml-1 font-normal text-gray-400">(auto)</span>}
                </FieldLabel>
                <div className="flex items-stretch gap-2">
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="100"
                    value={height}
                    disabled={!dims.height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                  <Tooltip title={dims.height ? "" : "Not used for this position"} disableHoverListener={dims.height}>
                    <span>{unitSelect(heightUnit, setHeightUnit)}</span>
                  </Tooltip>
                </div>
              </div>
              <div>
                <FieldLabel>
                  Width
                  {!dims.width && <span className="ml-1 font-normal text-gray-400">(auto)</span>}
                </FieldLabel>
                <div className="flex items-stretch gap-2">
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="100"
                    value={width}
                    disabled={!dims.width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                  {unitSelect(widthUnit, setWidthUnit)}
                </div>
              </div>
            </div>
          </Section>

          <Section
            title="Branding"
            description="Override the default heading and description shown to your users."
          >
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel hint="optional">Custom title</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. Connect your tools"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel hint="optional">Custom subtitle</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  placeholder="Enhance your experience with a diverse range of powerful integrations."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>
            </div>
          </Section>

          <Section
            title="Help document"
            description="Give users a link to your own documentation from inside the embed."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Link</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://docs.yoursite.com/embed"
                  value={helpLink}
                  onChange={(e) => setHelpLink(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. How integrations work"
                  value={helpTitle}
                  onChange={(e) => setHelpTitle(e.target.value)}
                />
              </div>
            </div>
          </Section>

          <Section
            title="Whitelist domains"
            description="Restrict where the embed can run. Leave empty to allow all domains."
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Enter a domain and press Enter"
              value={domainDraft}
              onChange={(e) => setDomainDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDomain();
                }
              }}
              slotProps={{
                input: {
                  endAdornment: domainDraft.trim() ? (
                    <InputAdornment position="end">
                      <Button size="small" onClick={addDomain}>
                        Add
                      </Button>
                    </InputAdornment>
                  ) : undefined,
                },
              }}
            />
            {domains.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {domains.map((d) => (
                  <Chip key={d} label={d} onDelete={() => setDomains((prev) => prev.filter((x) => x !== d))} />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-400">e.g. example.com, app.example.com</p>
            )}
          </Section>

          <Section
            title="Display options"
            description="Choose which capabilities appear inside the embed."
          >
            <div className="flex flex-col divide-y divide-gray-100">
              {TOGGLES.map((t) => (
                <div key={t.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{t.label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{t.help}</p>
                  </div>
                  <Switch
                    checked={toggles[t.key]}
                    onChange={(e) => setToggles((prev) => ({ ...prev, [t.key]: e.target.checked }))}
                  />
                </div>
              ))}
            </div>
          </Section>

          <Divider />
          <div className="flex items-center justify-end gap-2 pb-4">
            <Button variant="text" color="inherit">
              Reset
            </Button>
            <Button variant="contained">Save changes</Button>
          </div>
        </div>

        {/* ── Preview column ── */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <Paper variant="outlined" sx={{ borderColor: "divider", borderRadius: 2 }}>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <span className="text-sm font-semibold text-gray-900">Live preview</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                  {POSITIONS.find((p) => p.key === position)?.label}
                </span>
              </div>
              <div className="p-4">
                <Preview title={title} subtitle={subtitle} position={position} />
                <p className="mt-3 text-xs text-gray-400">
                  A representative preview. Actual appearance depends on your page styles.
                </p>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  startIcon={<ExpandIcon />}
                  onClick={() => setPreviewOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Show preview
                </Button>
              </div>
            </Paper>
          </div>
        </div>
      </div>

      {/* Full-size preview — rendered in the actual position the user selected */}

      {/* Left / Right slider → side drawer */}
      <Drawer
        anchor={position === "left" ? "left" : "right"}
        open={previewOpen && (position === "left" || position === "right")}
        onClose={() => setPreviewOpen(false)}
        slotProps={{ paper: { sx: { width: sliderWidth, maxWidth: "100vw" } } }}
      >
        {previewShell}
      </Drawer>

      {/* Full → full screen · Pop over / Popup → centered modal */}
      <Dialog
        open={previewOpen && (position === "full" || position === "popover" || position === "popup")}
        onClose={() => setPreviewOpen(false)}
        fullScreen={position === "full"}
        maxWidth={position === "popup" ? "xs" : "md"}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: position === "full" ? 0 : 2,
              width: position === "full" ? undefined : modalWidth,
              height:
                position === "full"
                  ? "100%"
                  : modalHeight ?? (position === "popup" ? "min(560px, 82vh)" : "min(680px, 82vh)"),
              maxHeight: "92vh",
            },
          },
        }}
      >
        {previewShell}
      </Dialog>
    </div>
  );
}
