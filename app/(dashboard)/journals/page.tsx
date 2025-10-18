import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { getAccountOptions } from '@/lib/loaders/accounts';
import { getJournals } from '@/lib/loaders/journals';
import JournalRegistration from './components/JournalRegistration';
import { JournalTable } from './components/JournalTable';

export const dynamic = 'force-dynamic';

const pageContent = {
    title: '取引一覧',
} as const;

export default async function JournalPage() {
    const [journals, accountOptions] = await Promise.all([getJournals(), getAccountOptions()]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PageBreadcrumb
                items={[{ label: 'ホーム', href: '/' }, { label: pageContent.title }]}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{pageContent.title}</h1>
                <JournalRegistration accountOptions={accountOptions} />
            </div>
            <JournalTable journals={journals} accountOptions={accountOptions} />
        </div>
    );
}
