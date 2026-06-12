"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  flowName?: string;
  flowIcon?: React.ReactNode;
  selectedStep?: {
    name: string;
    description: string;
  };
  onTest?: () => void;
  onPublish?: () => void;
  onClose?: () => void;
};

export function Composer({ value, onChange, onSend, disabled, placeholder, flowName, flowIcon, selectedStep, onTest, onPublish, onClose }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [value]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuWrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="flex flex-col bg-background/80 backdrop-blur px-4 py-4">
      <div className={cn(
        "mx-auto max-w-3xl w-full rounded-2xl",
        (flowName || selectedStep) ? "bg-gradient-to-b from-emerald-50 to-white border border-emerald-200/50" : "bg-background"
      )}>
        {(flowName || selectedStep) && (
          <div className="px-5 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 min-w-0">
                {selectedStep ? (
                  <>
                    <div className="flex size-4 shrink-0 items-center justify-center rounded bg-violet-100 text-violet-600 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-violet-900">{selectedStep.name}</p>
                      <p className="text-xs text-violet-700/70 mt-0.5">{selectedStep.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <SparkIcon className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-emerald-900">{flowName}</p>
                      <p className="text-xs text-emerald-700/70 mt-0.5">Active automation running smoothly</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selectedStep ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onTest}
                    className="text-xs cursor-pointer"
                  >
                    <PlayIcon className="size-3.5" />
                    Test
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onTest}
                      className="text-xs cursor-pointer"
                    >
                      <PlayIcon className="size-3.5" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      onClick={onPublish}
                      className="text-xs cursor-pointer"
                    >
                      Publish
                    </Button>
                  </>
                )}
                {selectedStep && (
                  <button
                    onClick={onClose}
                    className="inline-flex size-5 shrink-0 items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                    aria-label="Close flow"
                  >
                    <CloseIcon className="size-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="px-5 pb-3">
        <div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-2xl border-2 border-black bg-background px-3 py-2 transition-all",
            "focus-within:border-black focus-within:ring-2 focus-within:ring-black/20"
          )}
        >
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!disabled && value.trim()) onSend();
              }
            }}
            rows={1}
            placeholder={placeholder ?? "Describe an automation in plain language..."}
            className="min-h-[28px] flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          />
          <Button
            size="icon-sm"
            onClick={onSend}
            disabled={disabled || !value.trim()}
            aria-label="Send"
            className="cursor-pointer"
          >
            <ArrowUp />
          </Button>
          <div ref={menuWrapRef} className="relative">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setMenuOpen((v) => !v)}
              className="cursor-pointer"
              aria-label="More options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <DotsVertical />
            </Button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 bottom-full z-50 mb-2 w-48 overflow-hidden rounded-xl border border-border/70 bg-background py-1 shadow-lg"
              >
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 px-1 text-[11px] text-muted-foreground text-center">
          FlowMind can ask follow-up questions before deploying. Press Enter to send, Shift+Enter for new line.
        </p>
        </div>
        </div>
      </div>
    </div>
  );
}

function ArrowUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function DotsVertical(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

function FlowsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="18" r="2" />
      <path d="M6 8v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" /><path d="M12 12v4" />
    </svg>
  );
}
function LogsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" />
    </svg>
  );
}
function ReportsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="14 3 14 9 20 9" />
      <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}
function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function ProfileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

const MENU_ITEMS: { label: string; href: string; icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactElement }[] = [
  { label: "Flows", href: "/ai?panel=flows", icon: FlowsIcon },
  { label: "Logs", href: "/ai?panel=logs", icon: LogsIcon },
  { label: "Reports", href: "/ai?panel=reports", icon: ReportsIcon },
  { label: "Dashboard", href: "/ai?panel=dashboard", icon: DashboardIcon },
  { label: "Profile", href: "/ai?panel=profile", icon: ProfileIcon },
];
