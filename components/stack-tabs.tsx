"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

export function StackTabs({ tabs }: { tabs: { key: string; label: string; filename: string; code: string }[] }) {
  const [active, setActive] = useState(tabs[0].key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              active === t.key
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <CodeBlock filename={current.filename} code={current.code} />
    </div>
  );
}
