"use client";

import { useActionState, useEffect } from "react";
import { X } from 'lucide-react';
import { AccountTitleLabel, FormResponse, TaxCategoryLabel, TransactionTypeLabel } from "@/lib/types";
import { useJournal } from "@/hooks/useJournal";
import { createJournalEntry } from "@/lib/actions";
import { Field, SplitField } from "@/app/components/form/Field";
import { useToast } from "@/hooks/useToast";
import { AccountTitle, TaxCategory, TransactionType } from "@prisma/client";
import { Button } from "@/components/ui/button";

const JournalModal = () => {
    const { isModalOpen, closeModal, formData, setFormData } = useJournal();
    const { showToast } = useToast();

    const initialState: FormResponse = {
        success: false,
        message: '',
        field: undefined,
    };
    // manage form state with a server action
    const [state, formAction] = useActionState(createJournalEntry, initialState);

    // useEffect to show a toast when the form state changes after submission
    useEffect(() => {
        if (state.field) errFieldUpdate(state.field);

        if (state.message) {
            if (state.success) {
                showToast('success', '処理成功', state.message);
            } else {
                showToast('error', 'エラー', state.message);
            }
        }
    }, [state, showToast]);

    const errFieldUpdate = (errField: FormData) => {
        setFormData({
            transactionType: errField.get('transactionType') as TransactionType || formData.transactionType,
            occurrenceDate: errField.get('occurrenceDate') as string || formData.occurrenceDate,
            debitAccount: errField.get('debitAccount') as AccountTitle || formData.debitAccount,
            debitAmount: Number(errField.get('debitAmount')) || formData.debitAmount,
            debitTax: errField.get('debitTax') as TaxCategory || formData.debitTax,
            creditAccount: errField.get('creditAccount') as AccountTitle || formData.creditAccount,
            client: errField.get('client') as string || formData.client,
            paymentDate: errField.get('paymentDate') as string || formData.paymentDate,
            paymentAccount: errField.get('paymentAccount') as string || formData.paymentAccount,
            notes: errField.get('notes') as string || formData.notes,
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        if (name === 'creditAmount') {
            newFormData.debitAmount = Number(value);
        }
        setFormData(newFormData);
    };


    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
            <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">仕訳を登録</h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form action={formAction}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="収支区分">
                            <select
                                id="transactionType"
                                name="transactionType"
                                value={formData.transactionType}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                {Object.entries(TransactionTypeLabel).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="発生区分">
                            <input
                                type="date"
                                id="occurrenceDate"
                                name="occurrenceDate"
                                value={formData.occurrenceDate}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </Field>
                        <Field label="借方科目">
                            <select
                                id="debitAccount"
                                name="debitAccount"
                                value={formData.debitAccount}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                {Object.entries(AccountTitleLabel).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="貸方科目">
                            <select
                                id="creditAccount"
                                name="creditAccount"
                                value={formData.creditAccount}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                {Object.entries(AccountTitleLabel).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </Field>
                        <SplitField field={[
                            {
                                label: "金額",
                                children:
                                    <input type="number" id="debitAmount" name="debitAmount" value={formData.debitAmount} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                            },
                            {
                                label: "税区分",
                                children:
                                    <select id="debitTax" name="debitTax" value={formData.debitTax} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        {Object.entries(TaxCategoryLabel).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                            },
                        ]} />
                        <Field label="取引先">
                            <input
                                type="text"
                                id="client"
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </Field>
                        <Field label="決済日">
                            <input
                                type="date"
                                id="paymentDate"
                                name="paymentDate"
                                value={formData.paymentDate}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </Field>
                        <Field label="決済口座">
                            <input
                                type="text"
                                id="paymentAccount"
                                name="paymentAccount"
                                value={formData.paymentAccount}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </Field>
                        <Field label="備考" className="md:col-span-2">
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                value={formData.notes ?? ''}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                            </textarea>
                        </Field>
                    </div>
                    <div className="flex items-center justify-end p-4 dark:border-gray-700">
                        <Button variant="outline" onClick={closeModal}>キャンセル</Button>
                        <Button type="submit" className="ml-4">登録</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JournalModal;


