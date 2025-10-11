'use client';

import { createContext, useContext, useState } from 'react';
import type { AccountOption, JournalFormData } from '@/lib/types/types';

type JournalContextType = {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    formData: JournalFormData;
    setFormData: React.Dispatch<React.SetStateAction<JournalFormData>>;
    accountOptions: AccountOption[];
};

// Context Object
const JournalContext = createContext<JournalContextType | null>(null);

// Provider Component
export const JournalProvider = ({
    children,
    accountOptions,
}: {
    children: React.ReactNode;
    accountOptions: AccountOption[];
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<JournalFormData>({
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
        accountId: accountOptions[0]?.value || '',
        amount: '0',
        paymentAccount: 'CASH',
        taxType: 'TAXABLE_10',
        clientName: '',
        description: '',
        subAccount: '',
        memo: '',
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <JournalContext.Provider
            value={{
                isModalOpen,
                openModal,
                closeModal,
                formData,
                setFormData,
                accountOptions,
            }}
        >
            {children}
        </JournalContext.Provider>
    );
};

// Custom Hook is here...
export const useJournal = () => {
    const context = useContext(JournalContext);

    if (!context) {
        throw new Error('useJournal must be used within a JournalProvider');
    }

    return context;
};
