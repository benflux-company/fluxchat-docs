import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <Zap className="h-3.5 w-3.5 text-primary-foreground" />
              </span>
              fluxchat<span className="text-muted-foreground">/</span>sdk
            </Link>
            <span className="text-xs text-muted-foreground">A product by Benflux · MIT Licensed</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="https://www.npmjs.com/package/@fluxchat_sdk/sdk" target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">npm</a>
            <a href="https://fluxchat-corp.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">Dashboard</a>
            <a href="https://github.com/benflux-company/fluxchat-sdk" target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
