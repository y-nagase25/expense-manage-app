import { JournalProvider } from "@/hooks/useJournal";
import { getJournalEntries } from "@/lib/actions";
import RegisterButton from "./components/ResiterButton";
import JournalModal from "./components/JournalModal";
import { AccountTitleLabel } from "@/lib/types";
import ActionIcons from "./components/ActionIcons";
import TransactionTypeTag from "./components/TransactionTypeTag";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const JournalPage = async () => {
    const entries = await getJournalEntries();

    return (
        <JournalProvider>
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">仕訳帳</h1>
                    <RegisterButton />
                    <JournalModal />
                </div>
                <div className="rounded-lg border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>収支</TableHead>
                                    <TableHead>発生日</TableHead>
                                    <TableHead>借方勘定科目</TableHead>
                                    <TableHead className="text-right">借方金額</TableHead>
                                    <TableHead>取引先</TableHead>
                                    <TableHead>備考</TableHead>
                                    <TableHead className="w-[100px]">
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                                            データがありません
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    entries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                <TransactionTypeTag entry={entry} />
                                            </TableCell>
                                            <TableCell>{entry.occurrenceDate}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {AccountTitleLabel[entry.debitAccount]}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {entry.debitAmount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground max-w-xs truncate">
                                                {entry.client}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground max-w-xs truncate">
                                                {entry.notes}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end space-x-4">
                                                    <ActionIcons entry={entry} />
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
};

export default JournalPage;
