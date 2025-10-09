"use client";

import { useActionState, useCallback, useEffect } from "react";
import { AccountTitleLabel, FormResponse, TaxCategoryLabel, TransactionTypeLabel } from "@/lib/types";
import { useJournal } from "@/hooks/useJournal";
import { createJournalEntry } from "@/lib/actions";
import { useToast } from "@/hooks/useToast";
import { AccountTitle, TaxCategory, TransactionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

    const preserveFormData = useCallback((errField: FormData) => {
        setFormData(prevFormData => ({
            transactionType: errField.get('transactionType') as TransactionType || prevFormData.transactionType,
            occurrenceDate: errField.get('occurrenceDate') as string || prevFormData.occurrenceDate,
            debitAccount: errField.get('debitAccount') as AccountTitle || prevFormData.debitAccount,
            debitAmount: Number(errField.get('debitAmount')) || prevFormData.debitAmount,
            debitTax: errField.get('debitTax') as TaxCategory || prevFormData.debitTax,
            creditAccount: errField.get('creditAccount') as AccountTitle || prevFormData.creditAccount,
            client: errField.get('client') as string || prevFormData.client,
            paymentDate: errField.get('paymentDate') as string || prevFormData.paymentDate,
            paymentAccount: errField.get('paymentAccount') as string || prevFormData.paymentAccount,
            notes: errField.get('notes') as string || prevFormData.notes,
        }));
    }, [setFormData]);

    // useEffect to show a toast when the form state changes after submission
    useEffect(() => {
        if (state.field) preserveFormData(state.field);

        if (state.message) {
            if (state.success) {
                showToast('success', '処理成功', state.message);
            } else {
                showToast('error', 'エラー', state.message);
            }
        }
    }, [state, showToast, preserveFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
    };

    const handleSelectChange = (name: string, value: string) => {
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>仕訳を登録</DialogTitle>
                </DialogHeader>
                <form action={formAction}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="transactionType">収支区分</Label>
                            <Select
                                name="transactionType"
                                value={formData.transactionType}
                                onValueChange={(value) => handleSelectChange('transactionType', value)}
                            >
                                <SelectTrigger id="transactionType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(TransactionTypeLabel).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="occurrenceDate">発生日</Label>
                            <Input
                                type="date"
                                id="occurrenceDate"
                                name="occurrenceDate"
                                value={formData.occurrenceDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="debitAccount">借方科目</Label>
                            <Select
                                name="debitAccount"
                                value={formData.debitAccount}
                                onValueChange={(value) => handleSelectChange('debitAccount', value)}
                            >
                                <SelectTrigger id="debitAccount">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(AccountTitleLabel).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="creditAccount">貸方科目</Label>
                            <Select
                                name="creditAccount"
                                value={formData.creditAccount}
                                onValueChange={(value) => handleSelectChange('creditAccount', value)}
                            >
                                <SelectTrigger id="creditAccount">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(AccountTitleLabel).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="debitAmount">金額</Label>
                            <Input
                                type="number"
                                id="debitAmount"
                                name="debitAmount"
                                value={formData.debitAmount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="debitTax">税区分</Label>
                            <Select
                                name="debitTax"
                                value={formData.debitTax}
                                onValueChange={(value) => handleSelectChange('debitTax', value)}
                            >
                                <SelectTrigger id="debitTax">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(TaxCategoryLabel).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client">取引先</Label>
                            <Input
                                type="text"
                                id="client"
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentDate">決済日</Label>
                            <Input
                                type="date"
                                id="paymentDate"
                                name="paymentDate"
                                value={formData.paymentDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentAccount">決済口座</Label>
                            <Input
                                type="text"
                                id="paymentAccount"
                                name="paymentAccount"
                                value={formData.paymentAccount}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="notes">備考</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                value={formData.notes ?? ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={closeModal}>
                            キャンセル
                        </Button>
                        <Button type="submit">登録</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default JournalModal;
