import { notFound } from "next/navigation";
import Link from "next/link";
import { getJournalEntry, updateJournalEntry } from "@/lib/actions";
import { AccountTitleLabel, AccountType, TaxCategoryLabel } from "@/app/types";
import TransactionTypeTag from "../components/TransactionTypeTag";
import { JournalEntry } from "@prisma/client";
import Button from "@/app/components/common/Button";
import { Field, SplitField } from "@/app/components/form/Field";
import { InputSelect, InputText } from "@/app/components/form/Input";

type PageProps = {
    params: { id: string }
};

export default async function JournalDetailPage({ params }: PageProps) {
    const { id } = await params;
    const entry = await getJournalEntry(id);
    if (!entry) return notFound();

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Link href="/journals" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mb-4">
                <span className="mr-2">＜</span>戻る
            </Link>
            <h1 className="text-2xl font-semibold mb-6">仕訳詳細</h1>

            <form action={updateJournalEntry}>
                <input type="hidden" name="id" value={entry.id} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="収支区分">
                        <TransactionTypeTag entry={entry} />
                    </Field>
                    <Field label="発生日">
                        <InputText type="date" id="occurrenceDate" name="occurrenceDate" defaultValue={entry.occurrenceDate} />
                    </Field>
                    <Field label="借方科目">
                        <InputSelect labelMap={AccountTitleLabel} id="debitAccount" name="debitAccount" defaultValue={entry.debitAccount} />
                    </Field>
                    <Field label="貸方科目">
                        <InputSelect labelMap={AccountTitleLabel} id="creditAccount" name="creditAccount" defaultValue={entry.creditAccount} />
                    </Field>

                    <SplitField field={[
                        {
                            label: '金額',
                            children: <InputText id="debitAmount" name="debitAmount" defaultValue={String(entry.debitAmount)} />
                        },
                        {
                            label: '税区分',
                            children: <InputSelect labelMap={TaxCategoryLabel} id="debitTax" name="debitTax" defaultValue={entry.debitTax} />
                        },
                    ]} />

                    <Field label="取引先">
                        <InputText id="client" name="client" defaultValue={entry.client} />
                    </Field>
                    <Field label="決済日">
                        <InputText type="date" id="paymentDate" name="paymentDate" defaultValue={entry.paymentDate} />
                    </Field>
                    <Field label="決済口座">
                        <InputText id="paymentAccount" name="paymentAccount" defaultValue={entry.paymentAccount} />
                    </Field>
                    <Field label="備考" className="sm:col-span-2">
                        <InputText id="notes" name="notes" defaultValue={entry.notes ?? ""} />
                    </Field>
                </div>
                <div className="my-8">
                    <div className="text-sm text-gray-500 mb-2">仕訳プレビュー</div>
                    <JournalPreview entry={entry} />
                </div>
                <Button type="submit">更新</Button>
            </form>
        </div>
    );
}

const JournalPreview = ({ entry }: { entry: JournalEntry }) => {
    return (
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr>
                    <th className="border px-2 py-1 text-left"></th>
                    <th className="border px-2 py-1 text-left">借方</th>
                    <th className="border px-2 py-1 text-left">貸方</th>
                </tr>
                <tr>
                    <th className="border px-2 py-1 text-left">発生日</th>
                    <th className="border px-2 py-1 text-left">勘定科目・金額・税区分</th>
                    <th className="border px-2 py-1 text-left">勘定科目・金額・税区分</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border px-2 py-1">{entry.occurrenceDate}</td>
                    <td className="border px-2 py-1">
                        {AccountTitleLabel[entry.debitAccount]}<br />
                        {formatCurrency(entry.debitAmount)}
                        （{taxCategoryClassify(entry, 'DEBIT')}）<br />
                        {entry.client}
                    </td>
                    <td className="border px-2 py-1">
                        {AccountTitleLabel[entry.creditAccount]}<br />
                        {formatCurrency(entry.debitAmount)}
                        （{taxCategoryClassify(entry, 'CREDIT')}）<br />
                        {entry.client}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function taxCategoryClassify(entry: JournalEntry, accoutType: AccountType): string {
    if (accoutType === 'DEBIT') {
        // 売掛金：対象外
        if (entry.debitAccount === 'ACCOUNTS_RECEIVABLE') return '対象外';
    }
    if (accoutType === 'CREDIT') {
        // 売上高
        if (entry.creditAccount === 'SALES') return TaxCategoryLabel[entry.creditTax];
    }

    return '対象外';
}

function formatCurrency(n: number) {
    return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(n);
}


