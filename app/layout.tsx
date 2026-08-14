import type { Metadata } from "next";
import "./globals.css";
import { LeftNav } from "@/components/left-nav";
import { CommandPalette } from "@/components/command-palette";

export const metadata: Metadata = {
  title: "Workflows Control Center",
  description: "Manage and monitor your workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased overflow-hidden">
      <body className="h-full flex overflow-hidden">
        <LeftNav />
        <main className="flex-1 overflow-auto min-h-0 min-w-0">{children}</main>
        <CommandPalette />
      </body>
    </html>
  );
}
