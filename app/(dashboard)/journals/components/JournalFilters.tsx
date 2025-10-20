'use client';

import type { TransactionType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { AccountOption } from '@/lib/types/types';
import { TransactionTypeOptions } from '@/lib/types/types';

type JournalFiltersProps = {
    accountOptions: AccountOption[];
    transactionTypeFilter: TransactionType | 'ALL';
    debitAccountFilter: string;
    creditAccountFilter: string;
    onTransactionTypeChange: (value: TransactionType | 'ALL') => void;
    onDebitAccountChange: (value: string) => void;
    onCreditAccountChange: (value: string) => void;
    onReset: () => void;
};

export function JournalFilters({
    accountOptions,
    transactionTypeFilter,
    debitAccountFilter,
    creditAccountFilter,
    onTransactionTypeChange,
    onDebitAccountChange,
    onCreditAccountChange,
    onReset,
}: JournalFiltersProps) {
    const hasActiveFilters =
        transactionTypeFilter !== 'ALL' ||
        debitAccountFilter !== 'ALL' ||
        creditAccountFilter !== 'ALL';

    return (
        <div className="mb-6 rounded-lg border bg-card p-4">
            <div className="flex flex-wrap gap-4 items-end justify-between">
                {/* Left side: Filter items */}
                <div className="flex flex-wrap gap-4">
                    {/* Transaction Type Filter */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="transaction-type-filter"
                            className="text-xs font-medium text-foreground"
                        >
                            収支
                        </label>
                        <Select
                            value={transactionTypeFilter}
                            onValueChange={onTransactionTypeChange}
                        >
                            <SelectTrigger
                                id="transaction-type-filter"
                                className="text-xs"
                                size="sm"
                            >
                                <SelectValue placeholder="すべて" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">すべて</SelectItem>
                                {TransactionTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Debit Account Filter */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="debit-account-filter"
                            className="text-xs font-medium text-foreground"
                        >
                            借方勘定科目
                        </label>
                        <Select value={debitAccountFilter} onValueChange={onDebitAccountChange}>
                            <SelectTrigger id="debit-account-filter" className="text-xs" size="sm">
                                <SelectValue placeholder="すべて" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">すべて</SelectItem>
                                {accountOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Credit Account Filter */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="credit-account-filter"
                            className="text-xs font-medium text-foreground"
                        >
                            貸方勘定科目
                        </label>
                        <Select value={creditAccountFilter} onValueChange={onCreditAccountChange}>
                            <SelectTrigger id="credit-account-filter" className="text-xs" size="sm">
                                <SelectValue placeholder="すべて" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">すべて</SelectItem>
                                {accountOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Right side: Reset button */}
                <div>
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            onClick={onReset}
                            className="text-xs px-3 text-muted-foreground hover:text-foreground"
                            size="sm"
                        >
                            リセット
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
