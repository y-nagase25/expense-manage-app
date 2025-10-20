import { Suspense } from 'react';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import LedgerTable from './components/LedgerTable';
import { LedgerTableSkeleton } from './components/LedgerTableSkeleton';

const pageContent = {
    title: '総勘定元帳',
} as const;

export default async function LedgersPage() {
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
                    <Suspense fallback={<LedgerTableSkeleton />}>
                        <LedgerTable />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
