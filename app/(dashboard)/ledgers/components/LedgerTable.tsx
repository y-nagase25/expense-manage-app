import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatAmount } from '@/lib/format';
import { getLedgerSummary } from '@/lib/loaders/ledgers';

export default async function LedgerTable() {
    const ledgerSummaries = await getLedgerSummary();
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>勘定科目名</TableHead>
                    <TableHead className="text-right">借方金額</TableHead>
                    <TableHead className="text-right">貸方金額</TableHead>
                    <TableHead className="text-right">発生額累計</TableHead>
                    <TableHead className="text-right">残高</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ledgerSummaries.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                            データがありません
                        </TableCell>
                    </TableRow>
                ) : (
                    ledgerSummaries.map((ledger) => (
                        <TableRow key={ledger.accountId}>
                            <TableCell className="font-medium">
                                {ledger.accountCode} {ledger.accountName}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {formatAmount(ledger.debitTotal.toString())}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {formatAmount(ledger.creditTotal.toString())}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {formatAmount(ledger.totalAmount.toString())}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatAmount(ledger.balance.toString())}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
