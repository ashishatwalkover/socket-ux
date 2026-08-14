import type { Metadata } from "next";
import { Caveat } from "next/font/google";

// Caveat is a variable font — don't pin static weights (that generates
// per-weight slice URLs that 404 on gstatic and break the build).
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "viaSocket — Build Automations With AI",
  description: "AI-powered workflow automation with real human support when you need it.",
};

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`min-h-screen bg-white text-gray-900 ${caveat.variable}`}>{children}</div>;
}
