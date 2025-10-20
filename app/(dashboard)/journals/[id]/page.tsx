import { notFound } from 'next/navigation';
import { getAccountOptions } from '@/lib/loaders/accounts';
import { getSerializedJournal } from '@/lib/loaders/journals';
import { JournalDiplay } from './components/JournalDiplay';

export default async function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [serializedJournal, accountOptions] = await Promise.all([
        getSerializedJournal(id),
        getAccountOptions(),
    ]);
    if (!serializedJournal) return notFound();

    // Passing serialized data to the Client Component
    return <JournalDiplay journal={serializedJournal} accountOptions={accountOptions} />;
}
