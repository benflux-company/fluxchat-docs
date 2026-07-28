"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const Ctx = createContext<{ open: boolean; toggle: () => void; close: () => void }>({
  open: false,
  toggle: () => {},
  close: () => {},
});

export function MobileSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Ctx.Provider value={{ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useMobileSidebar() {
  return useContext(Ctx);
}
