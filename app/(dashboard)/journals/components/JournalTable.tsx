'use client';

import type { TransactionType } from '@prisma/client';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatAmount, formatDate } from '@/lib/format';
import type { SerializedJournal } from '@/lib/types/journals';
import type { AccountOption } from '@/lib/types/types';
import { cn } from '@/lib/utils';
import { ActionIcons } from './ActionIcons';
import { JournalFilters } from './JournalFilters';
import TransactionTypeTag from './TransactionTypeTag';

type JournalTableProps = {
    journals: SerializedJournal[];
    accountOptions: AccountOption[];
};

export function JournalTable({ journals, accountOptions }: JournalTableProps) {
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<TransactionType | 'ALL'>(
        'ALL'
    );
    const [debitAccountFilter, setDebitAccountFilter] = useState<string>('ALL');
    const [creditAccountFilter, setCreditAccountFilter] = useState<string>('ALL');

    // Filter journals based on selected filters
    const filteredJournals = useMemo(() => {
        return journals.filter((journal) => {
            // Filter by transaction type
            if (transactionTypeFilter !== 'ALL' && journal.type !== transactionTypeFilter) {
                return false;
            }

            // Filter by debit account
            if (debitAccountFilter !== 'ALL' && journal.debitAccountId !== debitAccountFilter) {
                return false;
            }

            // Filter by credit account
            if (creditAccountFilter !== 'ALL' && journal.creditAccountId !== creditAccountFilter) {
                return false;
            }

            return true;
        });
    }, [journals, transactionTypeFilter, debitAccountFilter, creditAccountFilter]);

    const handleReset = () => {
        setTransactionTypeFilter('ALL');
        setDebitAccountFilter('ALL');
        setCreditAccountFilter('ALL');
    };

    return (
        <>
            <JournalFilters
                accountOptions={accountOptions}
                transactionTypeFilter={transactionTypeFilter}
                debitAccountFilter={debitAccountFilter}
                creditAccountFilter={creditAccountFilter}
                onTransactionTypeChange={setTransactionTypeFilter}
                onDebitAccountChange={setDebitAccountFilter}
                onCreditAccountChange={setCreditAccountFilter}
                onReset={handleReset}
            />

            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>収支</TableHead>
                                <TableHead>日付</TableHead>
                                <TableHead>借方勘定科目</TableHead>
                                <TableHead>貸方勘定科目</TableHead>
                                <TableHead className="text-right">金額</TableHead>
                                <TableHead>取引先</TableHead>
                                <TableHead>備考</TableHead>
                                <TableHead className="w-[100px]">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredJournals.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center text-muted-foreground"
                                    >
                                        データがありません
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredJournals.map((j) => (
                                    <TableRow key={j.id}>
                                        <TableCell>
                                            <TransactionTypeTag transactionType={j.type} />
                                        </TableCell>
                                        <TableCell>{formatDate(j.date)}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {j.debitAccount.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {j.creditAccount.name}
                                        </TableCell>
                                        <TableCell
                                            className={cn(
                                                'text-right font-medium',
                                                j.type === 'INCOME'
                                                    ? 'text-success'
                                                    : 'text-destructive'
                                            )}
                                        >
                                            {formatAmount(j.amount)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground max-w-xs truncate">
                                            {j.clientName}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground max-w-xs truncate">
                                            {j.memo || j.description}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end space-x-4">
                                                <Link
                                                    href={`/journals/${j.id}`}
                                                    className="text-primary hover:text-primary/80"
                                                >
                                                    <Edit color="var(--primary)" size={24} />
                                                </Link>
                                                <ActionIcons id={j.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
