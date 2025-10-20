'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { ValidationErrors } from '@/components/common/ValidationErrors';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { useToast } from '@/hooks/useToast';
import {
    type AccountOption,
    type FormResponse,
    PaymentAccountLabel,
    TaxTypeLabel,
    TransactionTypeLabel,
} from '@/lib/types/types';
import { createJournalEntry } from '../actions';

type JournalRegistrationProps = {
    accountOptions: AccountOption[];
};

const JournalRegistration = ({ accountOptions }: JournalRegistrationProps) => {
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const errorCountRef = useRef(0);

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

    // Helper function to get default value from state.field or use initial value
    const getFieldValue = (fieldName: string, initialValue: string): string => {
        if (state.field) {
            const value = state.field.get(fieldName);
            return value ? String(value) : initialValue;
        }
        return initialValue;
    };

    // useEffect to show a toast when the form state changes after submission
    useEffect(() => {
        // Only process if state has actually changed (prevent infinite loop)
        if (state === prevStateRef.current) {
            return;
        }

        if (state.message && state.success) {
            showToast('success', '処理成功', state.message);
            setIsOpen(false); // Close modal on success
            setFormKey((prev) => prev + 1); // Reset form on success
        } else if (state.field) {
            // On error, increment error count to trigger form remount with preserved values
            errorCountRef.current += 1;
            showToast('error', state.message);
        }

        // Update ref to current state
        prevStateRef.current = state;
    }, [state, showToast]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">登録</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <ValidationErrors errors={state.errors} className="mb-4" />
                <form
                    key={state.field ? `error-${errorCountRef.current}` : formKey}
                    action={formAction}
                >
                    <DialogHeader>
                        <DialogTitle>取引を登録</DialogTitle>
                        <DialogDescription className="mt-2 mb-4">
                            取引は後から編集することも可能です。
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <FormLabel required tooltip="収入または支出を選択してください">
                                収支区分
                            </FormLabel>
                            <RadioGroup
                                name="type"
                                defaultValue={getFieldValue('type', 'EXPENSE')}
                                className="flex gap-4"
                            >
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
                                defaultValue={getFieldValue(
                                    'date',
                                    new Date().toISOString().split('T')[0]
                                )}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <FormLabel
                                htmlFor="debitAccountId"
                                required
                                tooltip="借方（取引の左側）の勘定科目を選択してください"
                            >
                                借方勘定科目
                            </FormLabel>
                            <Select
                                name="debitAccountId"
                                defaultValue={getFieldValue(
                                    'debitAccountId',
                                    accountOptions[0]?.value || ''
                                )}
                            >
                                <SelectTrigger id="debitAccountId">
                                    <SelectValue placeholder="借方勘定科目を選択" />
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
                            <FormLabel
                                htmlFor="creditAccountId"
                                required
                                tooltip="貸方（取引の右側）の勘定科目を選択してください"
                            >
                                貸方勘定科目
                            </FormLabel>
                            <Select
                                name="creditAccountId"
                                defaultValue={getFieldValue(
                                    'creditAccountId',
                                    accountOptions[0]?.value || ''
                                )}
                            >
                                <SelectTrigger id="creditAccountId">
                                    <SelectValue placeholder="貸方勘定科目を選択" />
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
                                defaultValue={getFieldValue('amount', '0')}
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
                                defaultValue={getFieldValue('taxType', 'TAXABLE_10')}
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
                                defaultValue={getFieldValue('clientName', '')}
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
                                defaultValue={getFieldValue('paymentAccount', 'CASH')}
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
                                defaultValue={getFieldValue('description', '')}
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
                                defaultValue={getFieldValue('memo', '')}
                                placeholder="詳細メモ（任意）"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline">キャンセル</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? '登録中...' : '登録'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default JournalRegistration;
