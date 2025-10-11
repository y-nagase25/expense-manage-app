'use client';

import type { Account } from '@prisma/client';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { formatCurrency, formatToJST } from '@/lib/format';
import type { SerializedJournal } from '@/lib/types/journals';
import {
    type AccountOption,
    type FormResponse,
    PaymentAccountLabel,
    TaxTypeLabel,
} from '@/lib/types/types';
import { updateJournalEntry } from '../actions';
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

type JournalWithAccount = SerializedJournal & { account: Account };

const JournalPreview = ({ journal }: { journal: JournalWithAccount }) => {
    // Format date
    const formattedDate = formatToJST(journal.date, false).slice(0, 10);

    // 取引の種類と勘定科目に基づいて借方と貸方を決定します
    const isIncome = journal.type === 'INCOME';
    const accountCategory = journal.account.category;

    let debitAccount: string;
    let creditAccount: string;

    if (isIncome) {
        if (
            // 資産(現金、売掛金、固定資産など)
            accountCategory === 'ASSET' ||
            accountCategory === 'LIABILITY' ||
            accountCategory === 'EQUITY'
        ) {
            debitAccount = `${journal.account.code} ${journal.account.name}`;
            creditAccount = '売上高';
        } else {
            // 収益(売上高、雑収入など)
            debitAccount = '普通預金';
            creditAccount = `${journal.account.code} ${journal.account.name}`;
        }
    } else {
        if (accountCategory === 'EXPENSE') {
            // 費用(仕入、経費、人件費など)
            debitAccount = `${journal.account.code} ${journal.account.name}`;
            creditAccount = PaymentAccountLabel[journal.paymentAccount];
        } else if (accountCategory === 'ASSET' || accountCategory === 'LIABILITY') {
            // 資産(現金、売掛金、固定資産など), 負債(買掛金、借入金など)
            debitAccount = `${journal.account.code} ${journal.account.name}`;
            creditAccount = PaymentAccountLabel[journal.paymentAccount];
        } else {
            // Default case
            debitAccount = `${journal.account.code} ${journal.account.name}`;
            creditAccount = PaymentAccountLabel[journal.paymentAccount];
        }
    }

    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">日付</TableHead>
                        <TableHead>借方</TableHead>
                        <TableHead>貸方</TableHead>
                        <TableHead className="w-[150px]">金額</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-mono text-sm">{formattedDate}</TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <div className="font-medium">{debitAccount}</div>
                                <div className="text-sm text-muted-foreground">
                                    {TaxTypeLabel[journal.taxType]}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <div className="font-medium">{creditAccount}</div>
                                <div className="text-sm text-muted-foreground">
                                    {TaxTypeLabel[journal.taxType]}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                            {formatCurrency(Number(journal.amount))}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} className="bg-muted/50">
                            <div className="space-y-1 text-sm">
                                <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                                    <TransactionTypeTag transactionType={journal.type} />
                                </div>
                                <div>
                                    <span className="text-muted-foreground">取引先:</span>
                                    <span className="font-medium">{journal.clientName}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">摘要:</span>
                                    <span>{journal.description ?? ''}</span>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};
