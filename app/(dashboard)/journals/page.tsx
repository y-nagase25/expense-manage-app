import { Suspense } from 'react';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { getAccountOptions } from '@/lib/loaders/accounts';
import JournalRegistration from './components/JournalRegistration';
import { JournalTable } from './components/JournalTable';
import { JournalTableSkeleton } from './components/JournalTableSkeleton';

const pageContent = {
    title: '取引一覧',
} as const;

export default async function JournalPage() {
    const accountOptions = await getAccountOptions();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PageBreadcrumb
                items={[{ label: 'ホーム', href: '/' }, { label: pageContent.title }]}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{pageContent.title}</h1>
                <JournalRegistration accountOptions={accountOptions} />
            </div>
            <Suspense fallback={<JournalTableSkeleton />}>
                <JournalTable />
            </Suspense>
        </div>
    );
}
