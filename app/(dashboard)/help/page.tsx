import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { createPageMetadata, PAGE_TITLES } from '@/lib/page-config';

export const metadata = createPageMetadata(PAGE_TITLES.HELP);

export default function HelpPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PageBreadcrumb
                items={[{ label: 'ホーム', href: '/home' }, { label: PAGE_TITLES.HELP }]}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{PAGE_TITLES.HELP}</h1>
            </div>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
                仕訳帳について
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                仕訳帳は、すべての取引を発生順に記録する帳簿です。複式簿記では、すべての取引を借方（左側）と貸方（右側）に分けて記録します。これを「仕訳」と呼びます。
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                仕訳の基本ルールは「借方の合計 =
                貸方の合計」です。例えば、現金で消耗品を購入した場合：
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>借方：消耗品（費用の発生）</li>
                <li>貸方：現金（資産の減少）</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                仕訳帳は青色申告の必須帳簿の一つで、確定申告時に税務署に提出する必要があります。
            </p>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
                総勘定元帳について
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                総勘定元帳は、仕訳帳で記録した取引を勘定科目ごとに分類・集計した帳簿です。各勘定科目（現金、売上、仕入、など）ごとにページを分けて、その勘定に関連するすべての取引を記録します。
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">総勘定元帳の主な目的：</p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>各勘定科目の残高を把握する</li>
                <li>損益計算書や貸借対照表の作成に必要な情報を整理する</li>
                <li>取引の流れを科目別に追跡する</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                総勘定元帳も青色申告の必須帳簿の一つで、仕訳帳と合わせて適切に記録・保存する必要があります。
            </p>
        </div>
    );
}
