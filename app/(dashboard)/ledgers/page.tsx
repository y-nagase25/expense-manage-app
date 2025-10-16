import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatAmount, formatBalance } from '@/lib/format';
import { getLedgerSummary } from '@/lib/loaders/ledgers';

export const dynamic = 'force-dynamic';

const pageContent = {
    title: '総勘定元帳',
} as const;

export default async function LedgersPage() {
    const ledgerSummaries = await getLedgerSummary();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PageBreadcrumb
                items={[{ label: 'ホーム', href: '/home' }, { label: pageContent.title }]}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{pageContent.title}</h1>
            </div>
            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="overflow-x-auto">
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
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground"
                                    >
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
                                            {formatBalance(ledger.balance.toString())}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
