'use client';

import type { PaymentAccount, TaxType, TransactionType } from '@prisma/client';
import { useActionState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useJournal } from '@/hooks/useJournal';
import { useToast } from '@/hooks/useToast';
import {
    type FormResponse,
    PaymentAccountLabel,
    TaxTypeLabel,
    TransactionTypeLabel,
} from '@/lib/types/types';
import { createJournalEntry } from '../actions';

const JournalModal = () => {
    const { isModalOpen, closeModal, formData, setFormData, accountOptions } = useJournal();
    const { showToast } = useToast();

    const initialState: FormResponse = {
        success: false,
        message: '',
        field: undefined,
    };

    // Manage form state with a server action
    const [state, formAction, isPending] = useActionState(createJournalEntry, initialState);

    const preserveFormData = useCallback(
        (errField: FormData) => {
            setFormData((prevFormData) => ({
                ...prevFormData,
                type: (errField.get('type') as TransactionType) || prevFormData.type || 'EXPENSE',
                date: (errField.get('date') as string) || prevFormData.date,
                accountId: (errField.get('accountId') as string) || prevFormData.accountId,
                amount: (errField.get('amount') as string) || prevFormData.amount,
                paymentAccount:
                    (errField.get('paymentAccount') as PaymentAccount) ||
                    prevFormData.paymentAccount ||
                    'CASH',
                taxType:
                    (errField.get('taxType') as TaxType) || prevFormData.taxType || 'TAXABLE_10',
                clientName: (errField.get('clientName') as string) || prevFormData.clientName,
                description: (errField.get('description') as string) || prevFormData.description,
                subAccount: (errField.get('subAccount') as string) || prevFormData.subAccount,
                memo: (errField.get('memo') as string) || prevFormData.memo,
            }));
        },
        [setFormData]
    );

    // useEffect to show a toast when the form state changes after submission
    useEffect(() => {
        if (state.field) preserveFormData(state.field);

        if (state.message) {
            if (state.success) {
                showToast('success', '処理成功', state.message);
                closeModal(); // Close modal on success
            } else {
                showToast('error', 'エラー', state.message);
            }
        }
    }, [state, showToast, preserveFormData, closeModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
    };

    const handleSelectChange = (name: string, value: string) => {
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);

        // Auto-set tax type when account changes
        if (name === 'accountId') {
            const selectedAccount = accountOptions.find((opt) => opt.value === value);
            if (selectedAccount) {
                setFormData({
                    ...newFormData,
                    taxType: selectedAccount.defaultTaxType,
                });
            }
        }
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
                            <Label htmlFor="type">収支区分</Label>
                            <Select
                                name="type"
                                value={formData.type}
                                onValueChange={(value) => handleSelectChange('type', value)}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(TransactionTypeLabel).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">日付</Label>
                            <Input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="accountId">勘定科目</Label>
                            <Select
                                name="accountId"
                                value={formData.accountId}
                                onValueChange={(value) => handleSelectChange('accountId', value)}
                            >
                                <SelectTrigger id="accountId">
                                    <SelectValue placeholder="勘定科目を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accountOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">金額</Label>
                            <Input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="0"
                                step="1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxType">税区分</Label>
                            <Select
                                name="taxType"
                                value={formData.taxType}
                                onValueChange={(value) => handleSelectChange('taxType', value)}
                            >
                                <SelectTrigger id="taxType">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(TaxTypeLabel).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="clientName">取引先</Label>
                            <Input
                                type="text"
                                id="clientName"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentAccount">決済方法</Label>
                            <Select
                                name="paymentAccount"
                                value={formData.paymentAccount}
                                onValueChange={(value) =>
                                    handleSelectChange('paymentAccount', value)
                                }
                            >
                                <SelectTrigger id="paymentAccount">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(PaymentAccountLabel).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">摘要</Label>
                            <Input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description ?? ''}
                                onChange={handleChange}
                                placeholder="取引の説明（任意）"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="memo">備考</Label>
                            <Textarea
                                id="memo"
                                name="memo"
                                rows={3}
                                value={formData.memo ?? ''}
                                onChange={handleChange}
                                placeholder="詳細メモ（任意）"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={closeModal}>
                            キャンセル
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? '登録中...' : '登録'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default JournalModal;
