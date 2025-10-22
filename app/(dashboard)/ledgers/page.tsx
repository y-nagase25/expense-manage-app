import { Suspense } from 'react';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { createPageMetadata, PAGE_TITLES } from '@/lib/page-config';
import LedgerTable from './components/LedgerTable';
import { LedgerTableSkeleton } from './components/LedgerTableSkeleton';

export const metadata = createPageMetadata(PAGE_TITLES.LEDGERS);

export default async function LedgersPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PageBreadcrumb
                items={[{ label: 'ホーム', href: '/home' }, { label: PAGE_TITLES.LEDGERS }]}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{PAGE_TITLES.LEDGERS}</h1>
            </div>
            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Suspense fallback={<LedgerTableSkeleton />}>
                        <LedgerTable />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
