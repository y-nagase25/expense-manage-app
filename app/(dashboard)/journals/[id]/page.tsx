import type { JournalEntry } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
import { getJournalEntry, updateJournalEntry } from '@/lib/actions';
import { formatCurrency, formatToJST } from '@/lib/format';
import { AccountTitleLabel, type AccountType, TaxCategoryLabel } from '@/lib/types';
import ClientToastOnUpdated from '../components/ClientToastOnUpdated';
import TransactionTypeTag from '../components/TransactionTypeTag';

export default async function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const entry = await getJournalEntry(id);
    if (!entry) return notFound();

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Link
                href="/journals"
                className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
            >
                <span className="mr-2">＜</span>戻る
            </Link>
            <h1 className="text-2xl font-semibold mb-6">仕訳詳細</h1>
            <div className="text-sm text-muted-foreground my-2 text-right">
                最終更新：{formatToJST(entry.updatedAt, false)}
            </div>

            <ClientToastOnUpdated />
            <form action={updateJournalEntry}>
                <input type="hidden" name="id" value={entry.id} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>収支区分</Label>
                        <div className="pt-2">
                            <TransactionTypeTag entry={entry} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="occurrenceDate">発生日</Label>
                        <Input
                            type="date"
                            id="occurrenceDate"
                            name="occurrenceDate"
                            defaultValue={entry.occurrenceDate}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="debitAccount">借方科目</Label>
                        <Select name="debitAccount" defaultValue={entry.debitAccount}>
                            <SelectTrigger id="debitAccount">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(AccountTitleLabel).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="creditAccount">貸方科目</Label>
                        <Select name="creditAccount" defaultValue={entry.creditAccount}>
                            <SelectTrigger id="creditAccount">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(AccountTitleLabel).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="debitAmount">金額</Label>
                        <Input
                            type="number"
                            id="debitAmount"
                            name="debitAmount"
                            defaultValue={String(entry.debitAmount)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="debitTax">税区分</Label>
                        <Select name="debitTax" defaultValue={entry.debitTax}>
                            <SelectTrigger id="debitTax">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(TaxCategoryLabel).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="client">取引先</Label>
                        <Input type="text" id="client" name="client" defaultValue={entry.client} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentDate">決済日</Label>
                        <Input
                            type="date"
                            id="paymentDate"
                            name="paymentDate"
                            defaultValue={entry.paymentDate}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentAccount">決済口座</Label>
                        <Input
                            type="text"
                            id="paymentAccount"
                            name="paymentAccount"
                            defaultValue={entry.paymentAccount}
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="notes">備考</Label>
                        <Input
                            type="text"
                            id="notes"
                            name="notes"
                            defaultValue={entry.notes ?? ''}
                        />
                    </div>
                </div>

                <div className="my-8">
                    <div className="text-sm text-muted-foreground mb-2">仕訳プレビュー</div>
                    <JournalPreview entry={entry} />
                </div>

                <Button type="submit">更新</Button>
            </form>
        </div>
    );
}

const JournalPreview = ({ entry }: { entry: JournalEntry }) => {
    return (
        <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead />
                        <TableHead>借方</TableHead>
                        <TableHead>貸方</TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead>発生日</TableHead>
                        <TableHead>勘定科目・金額・税区分</TableHead>
                        <TableHead>勘定科目・金額・税区分</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>{entry.occurrenceDate}</TableCell>
                        <TableCell>
                            {AccountTitleLabel[entry.debitAccount]}
                            <br />
                            {formatCurrency(entry.debitAmount)}（
                            {taxCategoryClassify(entry, 'DEBIT')}）<br />
                            {entry.client}
                        </TableCell>
                        <TableCell>
                            {AccountTitleLabel[entry.creditAccount]}
                            <br />
                            {formatCurrency(entry.debitAmount)}（
                            {taxCategoryClassify(entry, 'CREDIT')}）<br />
                            {entry.client}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

function taxCategoryClassify(entry: JournalEntry, accoutType: AccountType): string {
    if (accoutType === 'DEBIT') {
        // 売掛金：対象外
        if (entry.debitAccount === 'ACCOUNTS_RECEIVABLE') return '対象外';
    }
    if (accoutType === 'CREDIT') {
        // 売上高
        if (entry.creditAccount === 'SALES') return TaxCategoryLabel[entry.debitTax];
    }

    return '対象外';
}
