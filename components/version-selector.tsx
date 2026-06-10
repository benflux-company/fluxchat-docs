"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Version = "1" | "2";

const VersionCtx = createContext<{ version: Version; setVersion: (v: Version) => void }>({
  version: "2",
  setVersion: () => {},
});

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<Version>("2");
  return <VersionCtx.Provider value={{ version, setVersion }}>{children}</VersionCtx.Provider>;
}

export function useVersion() {
  return useContext(VersionCtx);
}

export function VersionSelect() {
  const { version, setVersion } = useVersion();
  return (
    <div className="mb-8 flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
      <span className="text-sm font-medium text-muted-foreground">API version</span>
      <div className="flex gap-2">
        {([
          { v: "2", label: "v2", badge: "Latest", badgeCls: "bg-primary/15 text-primary" },
          { v: "1", label: "v1", badge: "Stable", badgeCls: "bg-muted text-muted-foreground" },
        ] as const).map(({ v, label, badge, badgeCls }) => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              version === v
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
            <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", badgeCls)}>
              {badge}
            </span>
          </button>
        ))}
      </div>
      {version === "2" && (
        <p className="ml-auto hidden text-xs text-muted-foreground sm:block">
          v2 is recommended for all new integrations.
        </p>
      )}
      {version === "1" && (
        <p className="ml-auto hidden text-xs text-muted-foreground sm:block">
          v1 is stable — existing integrations are unaffected.
        </p>
      )}
    </div>
  );
}

/** Render different content depending on the selected version. */
export function VersionSwitch({ v1, v2 }: { v1: ReactNode; v2: ReactNode }) {
  const { version } = useVersion();
  return <>{version === "2" ? v2 : v1}</>;
}

/** Render children only when v2 is selected. */
export function V2Only({ children }: { children: ReactNode }) {
  const { version } = useVersion();
  if (version !== "2") return null;
  return <>{children}</>;
}

/** Render children only when v1 is selected. */
export function V1Only({ children }: { children: ReactNode }) {
  const { version } = useVersion();
  if (version !== "1") return null;
  return <>{children}</>;
}
