"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search, X, ArrowRight, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEARCH_DATA, type SearchItem } from "@/lib/search-data";

const fuse = new Fuse(SEARCH_DATA, {
  keys: [
    { name: "title", weight: 0.6 },
    { name: "description", weight: 0.3 },
    { name: "section", weight: 0.1 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
});

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelected(0);
      return;
    }
    const hits = fuse.search(query).slice(0, 8).map((r) => r.item);
    setResults(hits);
    setSelected(0);
  }, [query]);

  const navigate = useCallback(
    (item: SearchItem) => {
      onClose();
      router.push(item.href);
    },
    [onClose, router],
  );

  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && results[selected]) { navigate(results[selected]); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, results, selected, navigate, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd
            onClick={onClose}
            className="hidden cursor-pointer select-none rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex"
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-[60vh] overflow-y-auto py-2">
            {results.map((item, i) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item)}
                  onMouseEnter={() => setSelected(i)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors",
                    i === selected ? "bg-accent" : "hover:bg-accent/50",
                  )}
                >
                  <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    {item.section}
                  </span>
                  {i === selected && <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No results for <span className="font-medium text-foreground">"{query}"</span>
          </div>
        )}

        {/* Hint when empty */}
        {!query && (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground">
            Start typing to search across docs, SDK references, and more.
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1">↵</kbd> select</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1">ESC</kbd> close</span>
        </div>
      </div>
    </>
  );
}
