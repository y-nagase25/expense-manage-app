import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { getAccountOptions } from '@/lib/loaders/accounts';
import { getSerializedJournal } from '@/lib/loaders/journals';
import { JournalDiplay } from './components/JournalDiplay';

const pageContent = {
    title: '取引詳細',
    prevTitle: '取引一覧',
    prevLink: '/journals',
} as const;

export const metadata: Metadata = {
    title: pageContent.title,
};

export default async function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [serializedJournal, accountOptions] = await Promise.all([
        getSerializedJournal(id),
        getAccountOptions(),
    ]);
    if (!serializedJournal) return notFound();

    // Passing serialized data to the Client Component
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <PageBreadcrumb
                items={[
                    { label: 'ホーム', href: '/' },
                    { label: pageContent.prevTitle, href: pageContent.prevLink },
                    { label: pageContent.title },
                ]}
            />
            <h1 className="text-2xl font-semibold mb-6">{pageContent.title}</h1>
            <JournalDiplay journal={serializedJournal} accountOptions={accountOptions} />
        </div>
    );
}
