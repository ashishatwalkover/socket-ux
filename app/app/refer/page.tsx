"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { APP_BASE } from "@/lib/app-routes";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { blue, indigo, deepPurple, green, amber, pink, grey } from "@mui/material/colors";
import {
  LinkRounded,
  ContentCopyRounded,
  CheckRounded,
  TrendingUpRounded,
  WorkspacePremiumRounded,
  RocketLaunchRounded,
  BoltRounded,
  ShareRounded,
  PersonAddAlt1Rounded,
  PaidRounded,
  MilitaryTechRounded,
  SpaceDashboardRounded,
  ArrowForwardRounded,
  InfoOutlined,
  AllInclusiveRounded,
} from "@mui/icons-material";

const REFERRAL_LINK = "https://viasocket.com/join?ref=ASHISH-PARTNER";

/* ---- Tier model ----
   Benchmarks: Starter 1–4, Growth 5–14, Top 15+ referred clients. */
type Tier = {
  key: "starter" | "growth" | "top";
  name: string;
  rate: number;
  min: number;
  max: number | null;
  blurb: string;
  icon: React.ReactNode;
};

const TIERS: Tier[] = [
  {
    key: "starter",
    name: "Starter",
    rate: 30,
    min: 1,
    max: 4,
    blurb: "Start referring and earn 30% recurring commission.",
    icon: <BoltRounded />,
  },
  {
    key: "growth",
    name: "Growth Partner",
    rate: 40,
    min: 5,
    max: 14,
    blurb: "Reach the next milestone and unlock 40% commission.",
    icon: <RocketLaunchRounded />,
  },
  {
    key: "top",
    name: "Top Partner",
    rate: 50,
    min: 15,
    max: null,
    blurb: "Reach the highest milestone and unlock 50% commission.",
    icon: <WorkspacePremiumRounded />,
  },
];

/* Per-tier accent, drawn from the MUI color palette (@mui/material/colors). */
const TIER_COLOR: Record<Tier["key"], { soft: string; strong: string; border: string }> = {
  starter: { soft: blue[50], strong: blue[600], border: blue[400] },
  growth: { soft: indigo[50], strong: indigo[600], border: indigo[500] },
  top: { soft: amber[50], strong: amber[800], border: amber[600] },
};

/* How-it-works step accents, also from the MUI palette. */
const STEP_COLOR = [
  { soft: blue[50], strong: blue[600] },
  { soft: deepPurple[50], strong: deepPurple[600] },
  { soft: green[50], strong: green[600] },
  { soft: amber[50], strong: amber[800] },
  { soft: pink[50], strong: pink[600] },
];

/* ---- Sample partner state ---- */
const CLIENTS_REFERRED = 8;

function tierForCount(n: number): Tier {
  return [...TIERS].reverse().find((t) => n >= t.min) ?? TIERS[0];
}
function nextTier(current: Tier): Tier | null {
  const i = TIERS.findIndex((t) => t.key === current.key);
  return TIERS[i + 1] ?? null;
}

type Client = { name: string; plan: string; monthly: number; status: "active" | "pending" };

const CLIENTS: Client[] = [
  { name: "Northwind Traders", plan: "Premium", monthly: 99, status: "active" },
  { name: "Harbor Logistics", plan: "Premium", monthly: 99, status: "active" },
  { name: "BrightPath Clinic", plan: "Team", monthly: 79, status: "active" },
  { name: "Nimbus Retail", plan: "Team", monthly: 79, status: "active" },
  { name: "StudioLoop", plan: "Team", monthly: 79, status: "active" },
  { name: "FinApp", plan: "Team", monthly: 79, status: "active" },
  { name: "Quiver Dev", plan: "Solo", monthly: 39, status: "active" },
  { name: "Parcel App", plan: "Solo", monthly: 39, status: "active" },
];

const HOW_IT_WORKS = [
  {
    icon: <ShareRounded />,
    title: "Share your referral link",
    body: "Share viaSocket with your clients, audience, or network.",
  },
  {
    icon: <PersonAddAlt1Rounded />,
    title: "Your client signs up",
    body: "They join viaSocket through your referral link.",
  },
  {
    icon: <BoltRounded />,
    title: "Your client becomes active",
    body: "You start earning commission once they pay for viaSocket.",
  },
  {
    icon: <TrendingUpRounded />,
    title: "Reach the next milestone",
    body: "Bring more clients and unlock a higher commission tier.",
  },
  {
    icon: <AllInclusiveRounded />,
    title: "Earn more on your whole portfolio",
    body: "A higher tier applies your new rate to previous and future clients.",
  },
];

/* Shared card radius — MUI default (4px) is too tight for this layout. */
const CARD_SX = { borderRadius: 3, bgcolor: "background.paper" } as const;

function ReferAndEarnPageInner() {
  const params = useSearchParams();
  const isEmpty = params.get("state") === "empty";

  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
    } catch {
      /* clipboard unavailable in some sandboxes */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const clientsReferred = isEmpty ? 0 : CLIENTS_REFERRED;
  const activeClients = isEmpty ? [] : CLIENTS.filter((c) => c.status === "active");
  const currentTier = tierForCount(clientsReferred);
  const accent = TIER_COLOR[currentTier.key];
  const upcoming = nextTier(currentTier);
  const target = upcoming ? upcoming.min : currentTier.min;
  const toGo = Math.max(0, target - clientsReferred);
  const progressPct = Math.min(100, Math.round((clientsReferred / target) * 100));

  const monthlyRevenue = activeClients.reduce((s, c) => s + c.monthly, 0);
  const monthlyCommission = monthlyRevenue * (currentTier.rate / 100);
  const commissionAtNext = upcoming ? monthlyRevenue * (upcoming.rate / 100) : monthlyCommission;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* Header */}
        <header className="flex flex-wrap items-start gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Typography variant="h5" fontWeight={600} color="text.primary">
                Refer &amp; Earn
              </Typography>
              <Chip
                size="small"
                label="Partner Program"
                sx={{ fontWeight: 600, bgcolor: indigo[50], color: indigo[700] }}
              />
            </div>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Refer businesses to viaSocket and earn recurring commission every month they stay
              subscribed.
            </Typography>
          </div>
        </header>

        {/* Your progress — shown first, only when the partner has referrals */}
        {!isEmpty && (
          <section>
            <div className="flex items-center justify-between gap-3 mb-4">
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Your progress
              </Typography>
              <Button
                component={Link}
                href={APP_BASE}
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<SpaceDashboardRounded sx={{ fontSize: 18 }} />}
                endIcon={<ArrowForwardRounded sx={{ fontSize: 16 }} />}
                sx={{ whiteSpace: "nowrap", flexShrink: 0, color: "text.primary", borderColor: "divider" }}
              >
                Go to dashboard
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Progress card */}
              <Paper variant="outlined" className="lg:col-span-2" sx={CARD_SX}>
                <div className="px-6 py-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <ProgressStat label="Current level" value={currentTier.name} />
                    <ProgressStat label="Your commission" value={`${currentTier.rate}%`} color={accent.strong} />
                    <ProgressStat label="Clients referred" value={String(clientsReferred)} />
                    <ProgressStat
                      label="Next commission"
                      value={upcoming ? `${upcoming.rate}%` : "Maxed"}
                    />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-between">
                      <Typography variant="body2" fontWeight={500} color="text.primary">
                        {upcoming
                          ? `Next milestone: ${target} clients`
                          : "You've reached the top tier"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {clientsReferred} / {target} clients
                      </Typography>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={progressPct}
                      sx={{
                        mt: 1,
                        height: 8,
                        borderRadius: 999,
                        bgcolor: grey[100],
                        "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: accent.strong },
                      }}
                    />
                  </div>

                  {upcoming && (
                    <Box sx={{ mt: 2.5, p: 2, borderRadius: 2, bgcolor: accent.soft }}>
                      <div className="flex items-start gap-3">
                        <RocketLaunchRounded sx={{ fontSize: 20, color: accent.strong, mt: "2px" }} />
                        <Typography variant="body2" color="text.primary">
                          Refer{" "}
                          <Box component="span" sx={{ fontWeight: 600 }}>
                            {toGo} more {toGo === 1 ? "client" : "clients"}
                          </Box>{" "}
                          to unlock{" "}
                          <Box component="span" sx={{ fontWeight: 600 }}>
                            {upcoming.rate}% commission on all your referred clients
                          </Box>{" "}
                          — your monthly commission would rise from{" "}
                          <Box component="span" sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                            ${monthlyCommission.toFixed(0)}
                          </Box>{" "}
                          to{" "}
                          <Box component="span" sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                            ${commissionAtNext.toFixed(0)}
                          </Box>
                          .
                        </Typography>
                      </div>
                    </Box>
                  )}
                </div>
              </Paper>

              {/* Earnings snapshot */}
              <Paper variant="outlined" sx={CARD_SX}>
                <div className="px-6 py-6 h-full flex flex-col">
                  <div className="flex items-center gap-2">
                    <PaidRounded sx={{ fontSize: 18, color: green[600] }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500, textTransform: "uppercase", letterSpacing: ".05em" }}
                    >
                      Recurring earnings
                    </Typography>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <Typography variant="h4" fontWeight={600} color="text.primary" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      ${monthlyCommission.toFixed(0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">/mo</Typography>
                  </div>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {currentTier.rate}% of ${monthlyRevenue.toLocaleString()} across{" "}
                    {activeClients.length} active clients
                  </Typography>

                  <Box sx={{ mt: 2, p: 1.75, borderRadius: 2, bgcolor: green[50], border: "1px solid", borderColor: green[100] }}>
                    <Typography variant="caption" sx={{ color: green[700] }}>
                      Projected annual commission
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ color: green[800], fontVariantNumeric: "tabular-nums" }}>
                      ${(monthlyCommission * 12).toLocaleString()}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: "auto", pt: 2 }}>
                    Paid every month your referred clients stay subscribed.
                  </Typography>
                </div>
              </Paper>
            </div>
          </section>
        )}

        {/* Section 1: Hero */}
        <section>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              color: "#fff",
              background: `linear-gradient(135deg, ${indigo[600]} 0%, ${deepPurple[700]} 100%)`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box sx={{ position: "absolute", right: -40, top: -40, width: 224, height: 224, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)" }} />
            <Box sx={{ position: "absolute", right: 96, top: 96, width: 112, height: 112, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)" }} />

            <div className="relative px-8 py-9 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.12)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  <MilitaryTechRounded sx={{ fontSize: 15 }} />
                  The more you refer, the more you earn
                </Box>

                <Typography variant="h3" fontWeight={700} sx={{ mt: 2, lineHeight: 1.1 }}>
                  Refer more. Earn more.
                </Typography>
                <Typography variant="body1" sx={{ mt: 1.5, maxWidth: 520, color: "rgba(255,255,255,0.85)" }}>
                  Earn up to{" "}
                  <Box component="span" sx={{ fontWeight: 600, color: "#fff" }}>
                    50% recurring commission
                  </Box>{" "}
                  by referring businesses to viaSocket. Your commission increases as you reach
                  higher referral milestones.
                </Typography>

                {/* Referral link */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-2 max-w-xl">
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                      px: 1.75,
                      borderRadius: 1.5,
                      bgcolor: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <LinkRounded sx={{ fontSize: 18, color: "rgba(255,255,255,0.6)", flexShrink: 0 }} />
                    <Typography variant="body2" noWrap sx={{ color: "rgba(255,255,255,0.9)" }}>
                      {REFERRAL_LINK}
                    </Typography>
                  </Box>
                  <Button
                    onClick={copyLink}
                    variant="contained"
                    startIcon={
                      copied ? (
                        <CheckRounded sx={{ fontSize: 18 }} />
                      ) : (
                        <ContentCopyRounded sx={{ fontSize: 16 }} />
                      )
                    }
                    sx={{
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      bgcolor: "#fff",
                      color: indigo[700],
                      "&:hover": { bgcolor: grey[100] },
                    }}
                  >
                    {copied ? "Copied!" : "Copy referral link"}
                  </Button>
                </div>
                <Typography variant="caption" sx={{ mt: 1, display: "block", color: "rgba(255,255,255,0.6)" }}>
                  $0 to join. No caps. No complicated rules.
                </Typography>
              </div>

              {/* Tier ladder */}
              <div className="lg:col-span-2">
                <Box sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", p: 2.5 }}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".05em" }}>
                    Commission ladder
                  </Typography>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    {TIERS.map((t, i) => {
                      const isCurrent = t.key === currentTier.key;
                      const heights = [48, 64, 80];
                      return (
                        <div key={t.key} className="flex-1 text-center">
                          <Box
                            sx={{
                              height: heights[i],
                              borderRadius: "8px 8px 0 0",
                              display: "flex",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              pb: 0.5,
                              bgcolor: isCurrent ? "#fff" : "rgba(255,255,255,0.22)",
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: isCurrent ? indigo[700] : "#fff" }}>
                              {t.rate}%
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ mt: 0.75, display: "block", color: "rgba(255,255,255,0.8)" }}>
                            {t.name}
                          </Typography>
                        </div>
                      );
                    })}
                  </div>
                  <Typography variant="caption" sx={{ mt: 1.5, display: "block", textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
                    You&apos;re at{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: "#fff" }}>
                      {currentTier.rate}% — {currentTier.name}
                    </Box>
                  </Typography>
                </Box>
              </div>
            </div>
          </Paper>
        </section>

        {/* Section 2: Commission Levels */}
        <section>
          <div className="mb-4">
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Commission levels
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your rate upgrades as you refer more clients — 30% → 40% → 50%.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIERS.map((tier) => {
              const isCurrent = tier.key === currentTier.key;
              const c = TIER_COLOR[tier.key];
              return (
                <Paper
                  key={tier.key}
                  variant="outlined"
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    p: 3,
                    height: "100%",
                    bgcolor: "background.paper",
                    borderColor: isCurrent ? c.border : "divider",
                    borderWidth: isCurrent ? 2 : 1,
                    boxShadow: isCurrent ? 3 : 0,
                  }}
                >
                  {isCurrent && (
                    <Chip
                      size="small"
                      icon={<CheckRounded sx={{ fontSize: 14, color: "#fff !important" }} />}
                      label="Your level"
                      sx={{ position: "absolute", top: -14, left: 20, fontWeight: 600, bgcolor: c.strong, color: "#fff" }}
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: c.soft,
                        color: c.strong,
                      }}
                    >
                      {tier.icon}
                    </Box>
                    <Typography variant="h3" fontWeight={700} sx={{ color: c.strong, fontVariantNumeric: "tabular-nums" }}>
                      {tier.rate}%
                    </Typography>
                  </div>

                  <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ mt: 2 }}>
                    {tier.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {tier.blurb}
                  </Typography>

                  <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: 700 }}>
                      {tier.max
                        ? `${tier.min}–${tier.max} referred clients`
                        : `${tier.min}+ referred clients`}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </div>

          {/* Retroactive note under the tiers */}
          <div className="mt-3 flex items-center gap-2">
            <InfoOutlined sx={{ fontSize: 16, color: indigo[500] }} />
            <Typography variant="body2" color="text.secondary">
              Higher-tier commission applies to your{" "}
              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                previous and future
              </Box>{" "}
              referred clients.
            </Typography>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 2 }}>
            How it works
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HOW_IT_WORKS.map((step, i) => (
              <Paper key={step.title} variant="outlined" sx={{ ...CARD_SX, height: "100%" }}>
                <div className="px-5 py-5 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: STEP_COLOR[i].soft,
                        color: STEP_COLOR[i].strong,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: grey[300], lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                      {i + 1}
                    </Typography>
                  </div>
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mt: 1.5 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                    {step.body}
                  </Typography>
                </div>
              </Paper>
            ))}
          </div>
        </section>
      </div>
    </Box>
  );
}

function ProgressStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ mt: 0.5, fontWeight: color ? 700 : 600, color: color ?? "text.primary" }}
      >
        {value}
      </Typography>
    </div>
  );
}

export default function ReferAndEarnPage() {
  return (
    <Suspense fallback={<Box sx={{ minHeight: "100vh", bgcolor: "background.default" }} />}>
      <ReferAndEarnPageInner />
    </Suspense>
  );
}
