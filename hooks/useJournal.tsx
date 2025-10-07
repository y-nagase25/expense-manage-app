"use client";
import { InitialJournalEntry } from "@/lib/types";
import { createContext, useState, useContext } from "react";

type JournalContextType = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  formData: InitialJournalEntry;
  setFormData: React.Dispatch<React.SetStateAction<InitialJournalEntry>>;
}

// Context Object
const JournalContext = createContext<JournalContextType | null>(null);

// Provider Component
export const JournalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<InitialJournalEntry>({
    transactionType: "EXPENSE",
    occurrenceDate: new Date().toISOString().split('T')[0],
    debitAccount: "COMMUNICATION",
    debitAmount: 0,
    debitTax: "TAXABLE_10",
    creditAccount: "BANK_DEPOSIT",
    client: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentAccount: '',
    notes: '',
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <JournalContext.Provider value={{ isModalOpen, openModal, closeModal, formData, setFormData }}>
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