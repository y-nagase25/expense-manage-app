'use client';

import type { Account } from '@prisma/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatToJST } from '@/lib/format';
import type { SerializedJournal } from '@/lib/types/journals';
import { PaymentAccountLabel, TaxTypeLabel } from '@/lib/types/types';
import { cn } from '@/lib/utils';
import TransactionTypeTag from './TransactionTypeTag';

type Props = SerializedJournal & { account: Account };

export function JournalPreview({ journal }: { journal: Props }) {
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
                        <TableCell
                            className={cn(
                                'text-right font-mono font-medium',
                                journal.type === 'INCOME' ? 'text-emerald-600' : 'text-destructive'
                            )}
                        >
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
}
