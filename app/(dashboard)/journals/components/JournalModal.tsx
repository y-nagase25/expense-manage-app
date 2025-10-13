'use client';

import type { PaymentAccount, TaxType, TransactionType } from '@prisma/client';
import { useActionState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FormLabel } from '@/components/ui/form-label';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { ValidationErrors } from './ValidationErrors';

const JournalModal = () => {
    const { isModalOpen, closeModal, formData, setFormData, accountOptions } = useJournal();
    const { showToast } = useToast();

    const initialState: FormResponse = {
        success: false,
        message: '',
        field: undefined,
        errors: {},
    };

    // Manage form state with a server action
    const [state, formAction, isPending] = useActionState(createJournalEntry, initialState);

    // Track previous state to prevent infinite loop
    const prevStateRef = useRef<FormResponse>(initialState);

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

    // Filter account options based on transaction type
    const filteredAccountOptions = useMemo(() => {
        return accountOptions.filter((account) => {
            if (formData.type === 'INCOME') {
                // For INCOME transactions, show REVENUE and ASSET categories
                return account.category === 'REVENUE' || account.category === 'ASSET';
            }
            // For EXPENSE transactions, show EXPENSE, LIABILITY, and EQUITY categories
            return (
                account.category === 'EXPENSE' ||
                account.category === 'LIABILITY' ||
                account.category === 'EQUITY'
            );
        });
    }, [accountOptions, formData.type]);

    // Reset accountId if current selection is not valid for the selected transaction type
    useEffect(() => {
        if (formData.accountId) {
            const isValidAccount = filteredAccountOptions.some(
                (account) => account.value === formData.accountId
            );

            if (!isValidAccount) {
                setFormData((prev) => ({ ...prev, accountId: '' }));
            }
        }
    }, [formData.accountId, filteredAccountOptions, setFormData]);

    // useEffect to show a toast when the form state changes after submission
    useEffect(() => {
        // Only process if state has actually changed (prevent infinite loop)
        if (state === prevStateRef.current) {
            return;
        }

        if (state.field) preserveFormData(state.field);

        if (state.message && state.success) {
            showToast('success', '処理成功', state.message);
            closeModal(); // Close modal on success
        }

        // Update ref to current state
        prevStateRef.current = state;
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

                {/* Validation errors display */}
                <ValidationErrors errors={state.errors} className="mb-4" />

                <form action={formAction}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <FormLabel required tooltip="収入または支出を選択してください">
                                収支区分
                            </FormLabel>
                            <RadioGroup
                                value={formData.type}
                                onValueChange={(value) => handleSelectChange('type', value)}
                                className="flex gap-4"
                            >
                                {/* Hidden input for form submission */}
                                <input type="hidden" name="type" value={formData.type} />
                                {Object.entries(TransactionTypeLabel).map(([value, label]) => (
                                    <div key={value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={value} id={`type-${value}`} />
                                        <Label
                                            htmlFor={`type-${value}`}
                                            className="font-normal cursor-pointer"
                                        >
                                            {label}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <FormLabel
                                htmlFor="date"
                                required
                                tooltip="取引が発生した日付を入力してください"
                            >
                                日付
                            </FormLabel>
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
                            <FormLabel
                                htmlFor="accountId"
                                required
                                tooltip="取引内容に応じた勘定科目を選択してください"
                            >
                                勘定科目
                            </FormLabel>
                            <Select
                                name="accountId"
                                value={formData.accountId}
                                onValueChange={(value) => handleSelectChange('accountId', value)}
                            >
                                <SelectTrigger id="accountId">
                                    <SelectValue placeholder="勘定科目を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredAccountOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <FormLabel
                                htmlFor="amount"
                                required
                                tooltip="取引金額を入力してください（1〜8桁まで）"
                            >
                                金額
                            </FormLabel>
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
                            <FormLabel
                                htmlFor="taxType"
                                required
                                tooltip="消費税の課税区分を選択してください"
                            >
                                税区分
                            </FormLabel>
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
                            <FormLabel
                                htmlFor="clientName"
                                required
                                tooltip="取引先の名前を入力してください（最大30文字）"
                            >
                                取引先
                            </FormLabel>
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
                            <FormLabel
                                htmlFor="paymentAccount"
                                required
                                tooltip="入出金があった口座（銀行口座や現金）を選択してください。「プライベート資金」は、個人の財布や銀行口座から、事業用として資金を入出金した場合に選びます。"
                            >
                                口座
                            </FormLabel>
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
                            <FormLabel
                                htmlFor="description"
                                required={false}
                                tooltip="取引の簡単な説明を入力してください（最大50文字、任意）"
                            >
                                摘要
                            </FormLabel>
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
                            <FormLabel htmlFor="memo" required={false}>
                                備考
                            </FormLabel>
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
