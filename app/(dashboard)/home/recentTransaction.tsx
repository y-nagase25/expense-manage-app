import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { RecentTransaction } from '@/lib/loaders/journals';
import TransactionTypeTag from '../journals/components/TransactionTypeTag';

type RecentTransactionTableProps = {
    transactions: RecentTransaction[];
};

export function RecentTransactionTable({ transactions }: RecentTransactionTableProps) {
    return (
        <Table>
            <TableCaption>直近の取引を表示しています</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>種別</TableHead>
                    <TableHead>取引日時</TableHead>
                    <TableHead>勘定科目</TableHead>
                    <TableHead>取引先</TableHead>
                    <TableHead className="text-right">金額</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                            <TransactionTypeTag transactionType={transaction.type} />
                        </TableCell>
                        <TableCell>
                            {new Date(transaction.date).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })}
                        </TableCell>
                        <TableCell>{transaction.accountName}</TableCell>
                        <TableCell>{transaction.clientName}</TableCell>
                        <TableCell className="text-right">
                            ¥{transaction.amount.toLocaleString()}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
