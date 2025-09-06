"use client";
import { JournalEntry } from "@/app/types";
import { createContext, useState } from "react";

type JournalContextType = {
  entries: JournalEntry[];
  loading: boolean;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <JournalContext.Provider value={{ entries, loading }}>
      {children}
    </JournalContext.Provider>
  )
}