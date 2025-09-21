"use client";
import { JournalEntry } from "@/app/types";
import { createContext, useState, useContext } from "react";

type JournalContextType = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  entries: JournalEntry[];
  loading: boolean;
}

// Context Object
const JournalContext = createContext<JournalContextType | null>(null);

// Provider Component
export const JournalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <JournalContext.Provider value={{ isModalOpen, openModal, closeModal, entries, loading }}>
      {children}
    </JournalContext.Provider>
  )
}

// Custom Hook is here...
export const useJournal = () => {
  const context = useContext(JournalContext);

  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }

  return context;
};