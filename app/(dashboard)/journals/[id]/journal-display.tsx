'use client';

import { useActionState, useEffect, useRef } from 'react';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form-label';
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
import { useToast } from '@/hooks/useToast';
import { formatToJST } from '@/lib/format';
import type { SerializedJournal } from '@/lib/types/journals';
import {
    type AccountOption,
    type FormResponse,
    PaymentAccountLabel,
    TaxTypeLabel,
} from '@/lib/types/types';
import { updateJournalEntry } from '../actions';
import { JournalPreview } from '../components/journal-preview';
import TransactionTypeTag from '../components/TransactionTypeTag';
import { ValidationErrors } from '../components/ValidationErrors';

const pageContent = {
    title: '仕訳詳細',
    prevTitle: '仕訳一覧',
    prevLink: '/journals',
} as const;

type Props = {
    journal: SerializedJournal;
    accountOptions: AccountOption[];
};

export function JournalDiplay({ journal, accountOptions }: Props) {
    const { showToast } = useToast();

    const initialState: FormResponse = {
        success: false,
        message: '',
        field: undefined,
        errors: {},
    };

    const [state, formAction, isPending] = useActionState(updateJournalEntry, initialState);

    // Track previous state to prevent infinite loop
    const prevStateRef = useRef<FormResponse>(initialState);

    useEffect(() => {
        // Only process if state has actually changed (prevent infinite loop)
        if (state === prevStateRef.current) {
            return;
        }

        if (state.message && state.success) {
            showToast('success', '処理成功', state.message);
        }

        // Update ref to current state
        prevStateRef.current = state;
    }, [state, showToast]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <PageBreadcrumb
                items={[
                    { label: 'ホーム', href: '/' },
                    { label: pageContent.prevTitle, href: pageContent.prevLink },
                    { label: pageContent.title },
                ]}
            />
            <h1 className="text-2xl font-semibold mb-6">{pageContent.title}</h1>
            <div className="text-sm text-muted-foreground my-2 text-right">
                最終更新:{formatToJST(journal.updatedAt, false)}
            </div>

            {/* Validation errors display */}
            <ValidationErrors errors={state.errors} className="mb-6" />

            <form action={formAction}>
                <input type="hidden" name="id" value={journal.id} />
                <input type="hidden" name="type" value={journal.type} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>収支区分</Label>
                        <div className="pt-2">
                            <TransactionTypeTag transactionType={journal.type} />
                        </div>
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
                            defaultValue={formatToJST(journal.date, false).slice(0, 10)}
                            required
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <FormLabel
                            htmlFor="accountId"
                            required
                            tooltip="取引内容に応じた勘定科目を選択してください"
                        >
                            勘定科目
                        </FormLabel>
                        <Select name="accountId" defaultValue={journal.accountId}>
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
                            defaultValue={String(journal.amount)}
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
                        <Select name="taxType" defaultValue={journal.taxType}>
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
                            defaultValue={journal.clientName}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <FormLabel
                            htmlFor="paymentAccount"
                            required
                            tooltip="決済に使用した口座や方法を選択してください"
                        >
                            決済方法
                        </FormLabel>
                        <Select name="paymentAccount" defaultValue={journal.paymentAccount}>
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

                    <div className="space-y-2 sm:col-span-2">
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
                            defaultValue={journal.description ?? ''}
                            placeholder="取引の説明(任意)"
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <FormLabel htmlFor="memo" required={false}>
                            備考
                        </FormLabel>
                        <Textarea
                            id="memo"
                            name="memo"
                            rows={3}
                            defaultValue={journal.memo ?? ''}
                            placeholder="詳細メモ(任意)"
                        />
                    </div>
                </div>

                <div className="my-8">
                    <div className="text-sm text-muted-foreground mb-2">仕訳プレビュー</div>
                    <JournalPreview journal={journal} />
                </div>

                <Button disabled={isPending} type="submit">
                    {isPending ? '更新中...' : '更新'}
                </Button>
            </form>
        </div>
    );
}
