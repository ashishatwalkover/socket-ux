"use client";

import { useEffect, useRef, useState } from "react";

type StepId = "website" | "workspace" | "role" | "business" | "apps";

type Step =
  | { id: "website"; question: string; type: "url" }
  | { id: "workspace"; question: string; type: "text" }
  | { id: "role"; question: string; type: "choice"; options: string[] }
  | { id: "business"; question: string; type: "choice"; options: string[] }
  | { id: "apps"; question: string; type: "apps" };

type ChatItem =
  | { kind: "bot"; id: string; stepId: StepId; text: string }
  | { kind: "user"; id: string; stepId: StepId; text: string };

type AppOption = { name: string; color: string; letter: string };

const STEPS: Step[] = [
  { id: "website", question: "What's your company website?", type: "url" },
  { id: "workspace", question: "What should I call your workspace?", type: "text" },
  {
    id: "role",
    question: "Which best describes you?",
    type: "choice",
    options: [
      "Running a business",
      "Freelancer / consultant",
      "Part of a team",
      "Just exploring",
    ],
  },
  {
    id: "business",
    question: "What kind of business?",
    type: "choice",
    options: [
      "Tech / SaaS",
      "Agency / services",
      "E-commerce",
      "Other",
    ],
  },
  { id: "apps", question: "What apps do you use?", type: "apps" },
];

const MIN_APPS = 2;

const APP_OPTIONS: AppOption[] = [
  { name: "Google Sheets", color: "#0F9D58", letter: "G" },
  { name: "LeadConnector", color: "#FF6B35", letter: "L" },
  { name: "Airtable", color: "#18BFFF", letter: "A" },
  { name: "Slack", color: "#4A154B", letter: "S" },
  { name: "Shopify", color: "#96BF48", letter: "S" },
  { name: "HubSpot", color: "#FF7A59", letter: "H" },
  { name: "Zendesk Sell", color: "#03363D", letter: "Z" },
  { name: "ActiveCampaign", color: "#356AE6", letter: "A" },
  { name: "Gmail", color: "#EA4335", letter: "G" },
  { name: "Notion", color: "#000000", letter: "N" },
];

const DEFAULT_APPS = APP_OPTIONS.slice(0, 2).map((app) => app.name);

const FETCH_MESSAGES = [
  "Looking up your website…",
  "Fetching company details…",
  "Almost there…",
];

function stepIndexOf(id: StepId) {
  return STEPS.findIndex((s) => s.id === id);
}

function numberedQuestion(stepId: StepId, question: string) {
  return `${stepIndexOf(stepId) + 1}. ${question}`;
}

function companyNameFromWebsite(raw: string): string {
  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const host = new URL(withProtocol).hostname.replace(/^www\./i, "");
    const label = host.split(".")[0] ?? "";
    if (!label) return "";
    return label
      .split(/[-_]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  } catch {
    return "";
  }
}

function useTypewriter(text: string, active: boolean, speed = 28) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const activeText = active && text ? text : "";

  useEffect(() => {
    if (!activeText) {
      setShown("");
      setDone(false);
      return;
    }

    setShown("");
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(activeText.slice(0, i));
      if (i >= activeText.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);

    return () => window.clearInterval(id);
  }, [activeText, speed]);

  return { shown, done: done && shown === activeText && !!activeText };
}

function VioAvatar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.animate(
      [
        { transform: "translateX(-55vw) rotate(-420deg)", opacity: 0 },
        { transform: "translateX(0) rotate(0deg)", opacity: 1 },
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    );
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        display: "inline-block",
        width: 44,
        height: 44,
        opacity: 0,
        willChange: "transform, opacity",
      }}
    >
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="block">
        <rect width="44" height="44" rx="12" fill="#2f6bff" />
        <ellipse cx="14.5" cy="18" rx="2.8" ry="2.8" fill="white">
          <animate
            attributeName="ry"
            values="2.8;2.8;0.12;2.8;2.8;2.8;0.12;2.8;2.8"
            keyTimes="0;0.38;0.42;0.46;0.7;0.78;0.82;0.86;1"
            dur="4s"
            begin="1.2s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="29.5" cy="18" rx="2.8" ry="2.8" fill="white">
          <animate
            attributeName="ry"
            values="2.8;2.8;0.12;2.8;2.8;2.8;0.12;2.8;2.8"
            keyTimes="0;0.38;0.42;0.46;0.7;0.78;0.82;0.86;1"
            dur="4s"
            begin="1.2s"
            repeatCount="indefinite"
          />
        </ellipse>
        <path
          d="M12.5 26.5c2.4 3.4 5.6 5.2 9.5 5.2s7.1-1.8 9.5-5.2"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="mt-5 flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-neutral-300"
          style={{
            animation: "vioDot 1.1s ease-in-out infinite",
            animationDelay: `${i * 160}ms`,
          }}
        />
      ))}
    </div>
  );
}

function Cursor({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] animate-pulse bg-neutral-800 align-baseline" />
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <p className="text-[13px] font-medium text-neutral-400" aria-label={`Step ${current} of ${total}`}>
      {current}/{total}
    </p>
  );
}

type IntroPhase = "enter" | "greeting" | "subtitle" | "thinking" | "done";

export default function OnboardingPage() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>("enter");
  const [stepIndex, setStepIndex] = useState(0);
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [streamingQuestion, setStreamingQuestion] = useState<string | null>(null);
  const [inputReady, setInputReady] = useState(false);
  const [draft, setDraft] = useState("");
  const [awaitingNext, setAwaitingNext] = useState(false);
  const [fetchingWebsite, setFetchingWebsite] = useState(false);
  const [fetchMessageIndex, setFetchMessageIndex] = useState(0);
  const [suggestedName, setSuggestedName] = useState("");
  const [pendingFetchReveal, setPendingFetchReveal] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [appSearch, setAppSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentStep = STEPS[stepIndex] as Step | undefined;
  const introDone = introPhase === "done";
  const answeredCount = history.filter((h) => h.kind === "user").length;
  const isComplete = !currentStep && answeredCount > 0;
  const indicatorStep = isComplete
    ? STEPS.length
    : Math.min(stepIndex + 1, STEPS.length);
  const showIndicator =
    introDone &&
    !fetchingWebsite &&
    (inputReady || isComplete) &&
    !streamingQuestion &&
    !awaitingNext;
  const appsRemaining = Math.max(0, MIN_APPS - selectedApps.length);
  const appsReady = selectedApps.length >= MIN_APPS;
  const filteredApps = APP_OPTIONS.filter((app) =>
    app.name.toLowerCase().includes(appSearch.trim().toLowerCase())
  );

  const greeting = useTypewriter(
    "Hello, I'm Vio, here to set you up.",
    introPhase === "greeting" || introPhase === "subtitle" || introPhase === "thinking" || introPhase === "done"
  );
  const subtitle = useTypewriter(
    "Together we'll wire up your workspace. Just answer a few quick questions.",
    introPhase === "subtitle" || introPhase === "thinking" || introPhase === "done",
    18
  );
  const questionTw = useTypewriter(streamingQuestion ?? "", !!streamingQuestion, 22);
  const fetchStatus = useTypewriter(
    FETCH_MESSAGES[fetchMessageIndex] ?? "",
    fetchingWebsite,
    20
  );

  useEffect(() => {
    const land = window.setTimeout(() => setIntroPhase("greeting"), 1150);
    return () => window.clearTimeout(land);
  }, []);

  useEffect(() => {
    if (introPhase === "greeting" && greeting.done) {
      const t = window.setTimeout(() => setIntroPhase("subtitle"), 280);
      return () => window.clearTimeout(t);
    }
  }, [introPhase, greeting.done]);

  useEffect(() => {
    if (introPhase === "subtitle" && subtitle.done) {
      const t = window.setTimeout(() => setIntroPhase("thinking"), 320);
      return () => window.clearTimeout(t);
    }
  }, [introPhase, subtitle.done]);

  useEffect(() => {
    if (introPhase === "thinking") {
      const t = window.setTimeout(() => setIntroPhase("done"), 900);
      return () => window.clearTimeout(t);
    }
  }, [introPhase]);

  // After website fetch: show all remaining Q+A at once (like summary)
  useEffect(() => {
    if (!pendingFetchReveal || fetchingWebsite) return;

    const name = suggestedName || "My workspace";
    const workspace = STEPS.find((s) => s.id === "workspace");
    const role = STEPS.find((s) => s.id === "role");
    const business = STEPS.find((s) => s.id === "business");
    if (!workspace || !role || !business) return;

    setHistory((prev) => {
      const kept = prev.filter(
        (h) => stepIndexOf(h.stepId) < stepIndexOf("workspace")
      );
      return [
        ...kept,
        {
          kind: "bot",
          id: `q-${workspace.id}`,
          stepId: workspace.id,
          text: numberedQuestion(workspace.id, workspace.question),
        },
        {
          kind: "user",
          id: `a-${workspace.id}`,
          stepId: workspace.id,
          text: name,
        },
        {
          kind: "bot",
          id: `q-${role.id}`,
          stepId: role.id,
          text: numberedQuestion(role.id, role.question),
        },
        {
          kind: "user",
          id: `a-${role.id}`,
          stepId: role.id,
          text: "Running a business",
        },
        {
          kind: "bot",
          id: `q-${business.id}`,
          stepId: business.id,
          text: numberedQuestion(business.id, business.question),
        },
        {
          kind: "user",
          id: `a-${business.id}`,
          stepId: business.id,
          text: "Tech / SaaS",
        },
      ];
    });
    setPendingFetchReveal(false);
    setInputReady(false);
    setDraft("");
    setSelectedApps([]);
    setAppSearch("");
    setAwaitingNext(true);
    setStreamingQuestion(null);
    setStepIndex(stepIndexOf("apps"));
  }, [pendingFetchReveal, fetchingWebsite, suggestedName]);

  // Kick off first / next question
  useEffect(() => {
    if (
      !introDone ||
      !currentStep ||
      streamingQuestion ||
      awaitingNext ||
      fetchingWebsite ||
      pendingFetchReveal
    ) {
      return;
    }
    const alreadyAsked = history.some(
      (h) => h.kind === "bot" && h.stepId === currentStep.id
    );
    if (alreadyAsked) return;
    setInputReady(false);
    setStreamingQuestion(numberedQuestion(currentStep.id, currentStep.question));
  }, [
    introDone,
    currentStep,
    streamingQuestion,
    history,
    awaitingNext,
    fetchingWebsite,
    pendingFetchReveal,
  ]);

  useEffect(() => {
    if (!awaitingNext || !currentStep || fetchingWebsite || pendingFetchReveal) return;
    const alreadyAsked = history.some(
      (h) => h.kind === "bot" && h.stepId === currentStep.id
    );
    if (alreadyAsked) {
      setAwaitingNext(false);
      return;
    }
    const t = window.setTimeout(() => setAwaitingNext(false), 500);
    return () => window.clearTimeout(t);
  }, [awaitingNext, currentStep, history, fetchingWebsite, pendingFetchReveal]);

  useEffect(() => {
    if (!fetchingWebsite) return;

    if (fetchMessageIndex < FETCH_MESSAGES.length - 1) {
      if (!fetchStatus.done) return;
      const t = window.setTimeout(() => {
        setFetchMessageIndex((i) => i + 1);
      }, 480);
      return () => window.clearTimeout(t);
    }

    if (!fetchStatus.done) return;
    const t = window.setTimeout(() => {
      setFetchingWebsite(false);
      setPendingFetchReveal(true);
    }, 650);
    return () => window.clearTimeout(t);
  }, [fetchingWebsite, fetchMessageIndex, fetchStatus.done]);

  useEffect(() => {
    if (!streamingQuestion || !questionTw.done || !currentStep) return;
    setHistory((prev) => {
      if (prev.some((h) => h.kind === "bot" && h.stepId === currentStep.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          kind: "bot",
          id: `q-${currentStep.id}`,
          stepId: currentStep.id,
          text: numberedQuestion(currentStep.id, currentStep.question),
        },
      ];
    });
    setStreamingQuestion(null);
    setInputReady(true);
    setDraft((prevDraft) => {
      if (currentStep.id === "workspace") return suggestedName || prevDraft;
      if (currentStep.type === "choice" || currentStep.type === "apps") return "";
      return prevDraft;
    });
    if (currentStep.type === "apps") {
      setAppSearch("");
      setSelectedApps(DEFAULT_APPS);
    }
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [streamingQuestion, questionTw.done, currentStep, suggestedName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [
    history,
    streamingQuestion,
    inputReady,
    introPhase,
    awaitingNext,
    fetchingWebsite,
    fetchMessageIndex,
  ]);

  function nextStepIndex(from: number, answers: Record<string, string>) {
    let next = from + 1;
    while (next < STEPS.length) {
      const step = STEPS[next];
      if (
        step?.id === "business" &&
        answers.role &&
        answers.role !== "Running a business"
      ) {
        next += 1;
        continue;
      }
      break;
    }
    return next;
  }

  function answersFromHistory(items: ChatItem[]) {
    const map: Record<string, string> = {};
    for (const item of items) {
      if (item.kind === "user") map[item.stepId] = item.text;
    }
    return map;
  }

  function submitAnswer(value: string) {
    if (!currentStep) return;
    const trimmed = value.trim();
    const optional = currentStep.id === "website";

    if (!trimmed && !optional) return;
    if ((currentStep.type === "choice" || currentStep.type === "apps") && !trimmed) {
      return;
    }

    const answerText =
      currentStep.id === "website" && !trimmed ? "Skipped" : trimmed;

    const nextHistory: ChatItem[] = [
      ...history.filter((h) => {
        // Drop this step's old answer and anything after current step
        if (h.kind === "user" && h.stepId === currentStep.id) return false;
        return stepIndexOf(h.stepId) <= stepIndex;
      }),
      {
        kind: "user",
        id: `a-${currentStep.id}`,
        stepId: currentStep.id,
        text: answerText,
      },
    ];

    // Ensure bot question exists for this step
    if (!nextHistory.some((h) => h.kind === "bot" && h.stepId === currentStep.id)) {
      nextHistory.splice(nextHistory.length - 1, 0, {
        kind: "bot",
        id: `q-${currentStep.id}`,
        stepId: currentStep.id,
        text: numberedQuestion(currentStep.id, currentStep.question),
      });
    }

    setHistory(nextHistory);
    setInputReady(false);
    setDraft("");

    if (currentStep.id === "website" && trimmed) {
      setSuggestedName(companyNameFromWebsite(trimmed));
      setFetchMessageIndex(0);
      setFetchingWebsite(true);
      setStepIndex(stepIndexOf("workspace"));
      return;
    }

    if (currentStep.id === "website") {
      setSuggestedName("");
    }

    const answers = answersFromHistory(nextHistory);
    const next = nextStepIndex(stepIndex, answers);
    setAwaitingNext(true);
    setStepIndex(next);
  }

  function handleSubmit() {
    if (!currentStep) return;
    if (currentStep.type === "text" && !draft.trim()) return;
    if (currentStep.type === "choice" || currentStep.type === "apps") return;
    submitAnswer(draft);
  }

  function toggleApp(name: string) {
    setSelectedApps((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  }

  function submitApps() {
    if (!appsReady) return;
    submitAnswer(selectedApps.join(", "));
  }

  function goToStep(stepId: StepId) {
    if (fetchingWebsite || streamingQuestion || awaitingNext) return;

    const target = stepIndexOf(stepId);
    if (target < 0) return;

    const step = STEPS[target];
    if (!step) return;

    const prior = history.filter((h) => stepIndexOf(h.stepId) < target);
    const prevAnswer = history.find(
      (h) => h.kind === "user" && h.stepId === stepId
    );

    setHistory([
      ...prior,
      {
        kind: "bot",
        id: `q-${step.id}`,
        stepId: step.id,
        text: numberedQuestion(step.id, step.question),
      },
    ]);
    setStreamingQuestion(null);
    setAwaitingNext(false);
    setFetchingWebsite(false);
    setPendingFetchReveal(false);
    setStepIndex(target);
    setInputReady(true);
    setAppSearch("");

    if (step.type === "apps") {
      const names =
        prevAnswer && prevAnswer.kind === "user"
          ? prevAnswer.text.split(", ").filter(Boolean)
          : DEFAULT_APPS;
      setSelectedApps(names.length > 0 ? names : DEFAULT_APPS);
      setDraft("");
    } else {
      setSelectedApps([]);
      setDraft(
        prevAnswer && prevAnswer.kind === "user" && prevAnswer.text !== "Skipped"
          ? prevAnswer.text
          : step.id === "workspace"
            ? suggestedName
            : ""
      );
    }
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  // History shown above the active question (exclude current bot Q when editing)
  const visibleHistory = history.filter((item) => {
    if (
      inputReady &&
      currentStep &&
      item.kind === "bot" &&
      item.stepId === currentStep.id
    ) {
      return false;
    }
    if (
      inputReady &&
      currentStep &&
      item.kind === "user" &&
      item.stepId === currentStep.id
    ) {
      return false;
    }
    return true;
  });

  const showActiveQuestion =
    inputReady &&
    currentStep &&
    !streamingQuestion &&
    !fetchingWebsite &&
    currentStep.type !== "apps";

  return (
    <div className="flex min-h-screen justify-center overflow-x-hidden bg-white px-6 py-16">
      <div
        className={[
          "flex w-full flex-col text-left",
          currentStep?.type === "apps" ? "max-w-[640px]" : "max-w-[480px]",
        ].join(" ")}
      >
        <VioAvatar />

        {(introPhase === "greeting" ||
          introPhase === "subtitle" ||
          introPhase === "thinking" ||
          introPhase === "done") && (
          <h1 className="mt-7 text-[28px] font-semibold leading-tight tracking-tight text-neutral-900">
            {greeting.shown}
            <Cursor visible={introPhase === "greeting" && !greeting.done} />
          </h1>
        )}

        {(introPhase === "subtitle" ||
          introPhase === "thinking" ||
          introPhase === "done") && (
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
            {subtitle.shown}
            <Cursor visible={introPhase === "subtitle" && !subtitle.done} />
          </p>
        )}

        {introPhase === "thinking" && <ThinkingDots />}

        <div className="mt-8 flex flex-col gap-5">
          {visibleHistory.map((item) =>
            item.kind === "bot" ? (
              <p key={item.id} className="text-[16px] font-medium text-neutral-900">
                {item.text}
              </p>
            ) : (
              <div key={item.id} className="flex justify-end">
                <button
                  type="button"
                  onClick={() => goToStep(item.stepId)}
                  className="max-w-[85%] rounded-full bg-[#2f6bff] px-4 py-2 text-left text-[14px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                  title="Click to edit"
                >
                  {item.text}
                </button>
              </div>
            )
          )}

          {streamingQuestion && (
            <p className="text-[16px] font-medium text-neutral-900">
              {questionTw.shown}
              <Cursor visible={!questionTw.done} />
            </p>
          )}

          {showActiveQuestion && (
            <p className="text-[16px] font-medium text-neutral-900">
              {numberedQuestion(currentStep.id, currentStep.question)}
            </p>
          )}

          {fetchingWebsite && (
            <div>
              <p className="text-[15px] text-neutral-500">
                {fetchStatus.shown}
                <Cursor visible={!fetchStatus.done} />
              </p>
              <ThinkingDots />
            </div>
          )}

          {awaitingNext && !streamingQuestion && !fetchingWebsite && <ThinkingDots />}
        </div>

        {inputReady && currentStep?.type === "url" && (
          <div className="mt-4 opacity-0 animate-[onboardFade_300ms_ease-out_forwards]">
            <div className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2.5 focus-within:border-neutral-500">
              <span className="text-neutral-400">
                <GlobeIcon />
              </span>
              <input
                ref={inputRef}
                type="url"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="https://yoursite.com"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </div>
            <p className="mt-2.5 text-right text-[13px] text-neutral-400">
              Optional — you can{" "}
              <button
                type="button"
                onClick={() => submitAnswer("")}
                className="font-medium text-[#2f6bff] transition-opacity hover:opacity-80"
              >
                skip
              </button>
              .
            </p>
            {showIndicator && (
              <div className="mt-5">
                <StepIndicator current={indicatorStep} total={STEPS.length} />
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#2f6bff] px-4 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-opacity hover:opacity-90"
            >
              CONTINUE
              <ArrowIcon />
            </button>
          </div>
        )}

        {inputReady && currentStep?.type === "text" && (
          <div className="mt-4 opacity-0 animate-[onboardFade_300ms_ease-out_forwards]">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="workspacename"
              className="w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-500"
            />
            {suggestedName && draft === suggestedName && (
              <p className="mt-2.5 text-[13px] text-neutral-400">
                Suggested from your website — edit if you like.
              </p>
            )}
            {showIndicator && (
              <div className="mt-5">
                <StepIndicator current={indicatorStep} total={STEPS.length} />
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!draft.trim()}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#2f6bff] px-4 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              CONTINUE
              <ArrowIcon />
            </button>
          </div>
        )}

        {inputReady && currentStep?.type === "choice" && (
          <div className="mt-4 flex flex-col gap-2.5 opacity-0 animate-[onboardFade_300ms_ease-out_forwards]">
            {currentStep.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => submitAnswer(option)}
                className={[
                  "rounded-xl border px-4 py-3 text-left text-[14px] font-medium transition-colors",
                  draft === option
                    ? "border-[#2f6bff] bg-[#2f6bff]/5 text-[#2f6bff]"
                    : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300",
                ].join(" ")}
              >
                {option}
              </button>
            ))}
            {showIndicator && (
              <div className="mt-3">
                <StepIndicator current={indicatorStep} total={STEPS.length} />
              </div>
            )}
          </div>
        )}

        {inputReady && currentStep?.type === "apps" && (
          <div className="mt-4 opacity-0 animate-[onboardFade_300ms_ease-out_forwards]">
            <p className="text-[22px] font-semibold tracking-tight text-neutral-900">
              {numberedQuestion(currentStep.id, currentStep.question)}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2.5 focus-within:border-neutral-500">
              <span className="text-neutral-400">
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                type="search"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Search apps..."
                className="min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </div>

            <p className="mt-2.5 text-[13px] text-neutral-400">
              {appsReady
                ? `${selectedApps.length} apps selected`
                : "Select at least 2 apps to continue"}
            </p>

            <div className="mt-4 flex max-h-[320px] flex-wrap gap-2 overflow-y-auto pb-1">
              {filteredApps.map((app) => {
                const selected = selectedApps.includes(app.name);
                return (
                  <button
                    key={app.name}
                    type="button"
                    onClick={() => toggleApp(app.name)}
                    className={[
                      "inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                      selected
                        ? "border-[#2f6bff] bg-[#2f6bff] text-white"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300",
                    ].join(" ")}
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                      style={{
                        backgroundColor: selected ? "rgba(255,255,255,0.25)" : app.color,
                      }}
                      aria-hidden
                    >
                      {app.letter}
                    </span>
                    {app.name}
                  </button>
                );
              })}
              {filteredApps.length === 0 && (
                <p className="text-[13px] text-neutral-400">No apps found</p>
              )}
            </div>

            {showIndicator && (
              <div className="mt-6">
                <StepIndicator current={indicatorStep} total={STEPS.length} />
              </div>
            )}

            <button
              type="button"
              onClick={submitApps}
              disabled={!appsReady}
              className={[
                "mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-semibold tracking-wide transition-colors",
                appsReady
                  ? "bg-[#2f6bff] text-white hover:opacity-90"
                  : "cursor-not-allowed bg-neutral-200 text-neutral-500",
              ].join(" ")}
            >
              {appsReady ? "START BUILDING" : `PICK ${appsRemaining} MORE`}
              <ArrowIcon />
            </button>
          </div>
        )}

        {isComplete && (
          <div className="mt-8">
            <p className="text-[14px] text-neutral-400">You&apos;re all set for now.</p>
            {showIndicator && (
              <div className="mt-5">
                <StepIndicator current={indicatorStep} total={STEPS.length} />
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <style>{`
        @keyframes onboardFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes vioDot {
          0%, 80%, 100% { opacity: 0.35; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
