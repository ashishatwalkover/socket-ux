import type { Metadata } from "next";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-caveat" });

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
