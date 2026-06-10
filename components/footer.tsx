import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </span>
          fluxchat<span className="text-muted-foreground">/</span>sdk
        </Link>
        <span className="sm:ml-2">A product by Benflux · MIT Licensed</span>
        <div className="flex gap-5 sm:ml-auto">
          <a href="https://www.npmjs.com/package/@fluxchat_sdk/sdk" target="_blank" rel="noreferrer" className="hover:text-foreground">npm</a>
          <a href="https://fluxchat-corp.com" target="_blank" rel="noreferrer" className="hover:text-foreground">Dashboard</a>
          <a href="https://github.com/benflux-company/fluxchat-sdk" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
