"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Workflows Control Center", href: "/" },
  { name: "Workflows Focus View", href: "/focus" },
  { name: "Design 3", href: "/design-3" },
  { name: "Design 4", href: "/design-4" },
];

export function LeftNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r bg-muted/30 p-4 flex flex-col gap-2">
      <div className="mb-4">
        <h2 className="text-lg font-semibold px-3 mb-2">UX Designs</h2>
        <p className="text-xs text-muted-foreground px-3">
          Select a design to preview
        </p>
      </div>
      
      <div className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t">
        <p className="text-xs text-muted-foreground px-3">
          💡 Add more designs by creating new routes
        </p>
      </div>
    </nav>
  );
}
