import { TemplateCards } from "@/components/ai/template-cards";

const TimerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="13" r="8"/>
    <path d="M12 9v4l3 2"/>
  </svg>
);

const FlowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <path d="M7 10v4M17 10v4M7 14h10"/>
  </svg>
);

const SheetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#34A853"/>
  </svg>
);

const GmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#EA4335"/>
  </svg>
);

const TEMPLATES = [
  {
    id: "sheets-gmail",
    title: "Automate AI Follow-ups from Google Sheets to Gmail (3-Step Sequence)",
    icons: [<TimerIcon key="timer" />, <FlowIcon key="flow" />, <SheetIcon key="sheet" />],
    moreCount: 7,
    chips: ["Accounting", "Ads and ..."],
    installs: 69,
    imageStyle: "slider" as const,
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "crm-automation",
    title: "Lead Capture & CRM Sync with Automated Notifications",
    icons: [<SheetIcon key="sheet" />, <GmailIcon key="gmail" />, <FlowIcon key="flow" />],
    moreCount: 5,
    chips: ["CRM", "Lead Management", "Email"],
    installs: 142,
    imageStyle: "gallery" as const,
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop",
    ],
  },
];

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates</h1>
          <p className="text-gray-600">Choose a template to get started with your automation</p>
        </div>

        <TemplateCards templates={TEMPLATES} />
      </div>
    </div>
  );
}
