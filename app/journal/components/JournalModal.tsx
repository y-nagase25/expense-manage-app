"use client";
import { useEffect, useState } from "react";
import { CloseIcon } from "../../components/icons/icons";
import { AccountTitleLabel, InitialJournalEntry, JournalEntry, TaxCategoryLabel, TransactionTypeLabel } from "../../types";
import { useJournal } from "@/hooks/useJournal";

type JournalModalProps = {
    entry?: JournalEntry;
};

const JournalModal = ({ entry }: JournalModalProps) => {
    const { isModalOpen, closeModal } = useJournal();
    // const { addEntry, updateEntry } = useJournal();
    const [formData, setFormData] = useState<InitialJournalEntry>({
        transactionType: "EXPENSE",
        occurrenceDate: new Date().toISOString().split('T')[0],
        debitAccount: "COMMUNICATION",
        debitAmount: 0,
        debitTax: "TAXABLE_10",
        creditAccount: "BANK_ACCOUNT",
        creditAmount: 0,
        creditTax: "TAXABLE_10",
        client: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentAccount: '',
        notes: '',
    });

    useEffect(() => {
        if (entry) {
            setFormData(entry);
        } else {
            // Reset to default for new entry
        }
    }, [entry]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };
        console.log(newFormData);

        if (name === 'debitAmount') {
            newFormData.creditAmount = Number(value);
        } else if (name === 'creditAmount') {
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
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{entry ? '仕訳を編集' : '仕訳を登録'}</h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* General Info */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">収支区分</label>
                                <select id="transactionType" name="transactionType" value={formData.transactionType} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {Object.values(TransactionTypeLabel).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="occurrenceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">発生日</label>
                                <input type="date" id="occurrenceDate" name="occurrenceDate" value={formData.occurrenceDate} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                            </div>
                        </div>

                        {/* Debit Side */}
                        <div className="p-4 border rounded-md dark:border-gray-600">
                            <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">借方</h4>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="debitAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">勘定科目</label>
                                    <select id="debitAccount" name="debitAccount" value={formData.debitAccount} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        {Object.values(AccountTitleLabel).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="debitAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">金額</label>
                                    <input type="number" id="debitAmount" name="debitAmount" value={formData.debitAmount} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                </div>
                                <div>
                                    <label htmlFor="debitTax" className="block text-sm font-medium text-gray-700 dark:text-gray-300">税区分</label>
                                    <select id="debitTax" name="debitTax" value={formData.debitTax} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        {Object.values(TaxCategoryLabel).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Credit Side */}
                        <div className="p-4 border rounded-md dark:border-gray-600">
                            <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">貸方</h4>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="creditAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">勘定科目</label>
                                    <select id="creditAccount" name="creditAccount" value={formData.creditAccount} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        {Object.values(AccountTitleLabel).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">金額</label>
                                    <input type="number" id="creditAmount" name="creditAmount" value={formData.creditAmount} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                </div>
                                <div>
                                    <label htmlFor="creditTax" className="block text-sm font-medium text-gray-700 dark:text-gray-300">税区分</label>
                                    <select id="creditTax" name="creditTax" value={formData.creditTax} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        {Object.values(TaxCategoryLabel).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Other details */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300">取引先</label>
                                <input type="text" id="client" name="client" value={formData.client} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                            </div>
                            <div>
                                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">決済日</label>
                                <input type="date" id="paymentDate" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="paymentAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">決済口座</label>
                                <input type="text" id="paymentAccount" name="paymentAccount" value={formData.paymentAccount} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">備考</label>
                            <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                    </div>
                    {/* Button */}
                    <div className="flex items-center justify-end p-4 border-t dark:border-gray-700">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 mr-2">キャンセル</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">保存</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JournalModal;


