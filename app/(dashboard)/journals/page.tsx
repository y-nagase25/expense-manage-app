import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { JournalProvider } from '@/hooks/useJournal';
import { getAccountOptions } from '@/lib/loaders/accounts';
import { getJournals } from '@/lib/loaders/journals';
import { cn } from '@/lib/utils';
import ActionIcons from './components/ActionIcons';
import JournalModal from './components/JournalModal';
import RegisterButton from './components/ResiterButton';
import TransactionTypeTag from './components/TransactionTypeTag';

export const dynamic = 'force-dynamic';

const pageContent = {
    title: '仕訳一覧',
} as const;

export default async function JournalPage() {
    const [journals, accountOptions] = await Promise.all([getJournals(), getAccountOptions()]);

    // Format amount with currency
    const formatAmount = (amount: number | string) => {
        const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(num);
    };

    // Format date to YYYY-MM-DD
    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <JournalProvider accountOptions={accountOptions}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <PageBreadcrumb
                    items={[{ label: 'ホーム', href: '/' }, { label: pageContent.title }]}
                />
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{pageContent.title}</h1>
                    <RegisterButton />
                    <JournalModal />
                </div>
                <div className="rounded-lg border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>収支</TableHead>
                                    <TableHead>日付</TableHead>
                                    <TableHead>勘定科目</TableHead>
                                    <TableHead className="text-right">金額</TableHead>
                                    <TableHead>取引先</TableHead>
                                    <TableHead>備考</TableHead>
                                    <TableHead className="w-[100px]">
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {journals.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-muted-foreground"
                                        >
                                            データがありません
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    journals.map((j) => (
                                        <TableRow key={j.id}>
                                            <TableCell>
                                                <TransactionTypeTag transactionType={j.type} />
                                            </TableCell>
                                            <TableCell>{formatDate(j.date)}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {j.account.name}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'text-right font-medium',
                                                    j.type === 'INCOME'
                                                        ? 'text-success'
                                                        : 'text-destructive'
                                                )}
                                            >
                                                {formatAmount(j.amount.toString())}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground max-w-xs truncate">
                                                {j.clientName}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground max-w-xs truncate">
                                                {j.memo || j.description}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end space-x-4">
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
            </div>
        </JournalProvider>
    );
}
