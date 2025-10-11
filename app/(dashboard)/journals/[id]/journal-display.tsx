'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
    };

    const [state, formAction, isPending] = useActionState(updateJournalEntry, initialState);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                showToast('success', '処理成功', state.message);
            } else {
                showToast('error', 'エラー', state.message);
            }
        }
    }, [state, showToast]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link
                href="/journals"
                className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
            >
                <span className="mr-2">＜</span>戻る
            </Link>
            <h1 className="text-2xl font-semibold mb-6">仕訳詳細</h1>
            <div className="text-sm text-muted-foreground my-2 text-right">
                最終更新:{formatToJST(journal.updatedAt, false)}
            </div>

            <form action={formAction}>
                <input type="hidden" name="id" value={journal.id} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>収支区分</Label>
                        <div className="pt-2">
                            <TransactionTypeTag transactionType={journal.type} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">日付</Label>
                        <Input
                            type="date"
                            id="date"
                            name="date"
                            defaultValue={formatToJST(journal.date, false).slice(0, 10)}
                            required
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="accountId">勘定科目</Label>
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
                        <Label htmlFor="amount">金額</Label>
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
                        <Label htmlFor="taxType">税区分</Label>
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
                        <Label htmlFor="clientName">取引先</Label>
                        <Input
                            type="text"
                            id="clientName"
                            name="clientName"
                            defaultValue={journal.clientName}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentAccount">決済方法</Label>
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
                        <Label htmlFor="description">摘要</Label>
                        <Input
                            type="text"
                            id="description"
                            name="description"
                            defaultValue={journal.description ?? ''}
                            placeholder="取引の説明(任意)"
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="memo">備考</Label>
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
