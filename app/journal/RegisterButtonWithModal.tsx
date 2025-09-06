"use client";
import { useState } from "react";
import RegisterButton from "./ResiterButton";
import JournalModal from "@/app/journal/JournalModal";
import { JournalEntry } from "../types";

const RegisterButtonWithModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

    const handleOpenModal = (entry?: JournalEntry | null) => {
        setEditingEntry(entry ?? null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEntry(null);
    };

    return (
        <>
            <RegisterButton onOpen={() => handleOpenModal(null)} />
            {isModalOpen && (
                <JournalModal isOpen={isModalOpen} onClose={handleCloseModal} entry={editingEntry} />
            )}
        </>
    );
};

export default RegisterButtonWithModal;


