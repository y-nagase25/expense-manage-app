'use client';

import TransactionTypeTag from '@/components/common/TransactionTypeTag';
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
import { cn } from '@/lib/utils';

export function JournalPreview({ journal }: { journal: SerializedJournal }) {
    // Format date
    const formattedDate = formatToJST(journal.date, false).slice(0, 10);

    // 借方・貸方の勘定科目を直接表示
    const debitAccount = `${journal.debitAccount.code} ${journal.debitAccount.name}`;
    const creditAccount = `${journal.creditAccount.code} ${journal.creditAccount.name}`;

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
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <div className="font-medium">{creditAccount}</div>
                            </div>
                        </TableCell>
                        <TableCell
                            className={cn(
                                'text-right font-mono font-medium',
                                journal.type === 'INCOME' ? 'text-success' : 'text-destructive'
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
