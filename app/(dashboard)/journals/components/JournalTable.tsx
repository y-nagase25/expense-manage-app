import { getAccountOptions } from '@/lib/loaders/accounts';
import { getJournals } from '@/lib/loaders/journals';
import { JournalTableClient } from './JournalTableClient';

export async function JournalTable() {
    const [journals, accountOptions] = await Promise.all([getJournals(), getAccountOptions()]);

    return <JournalTableClient journals={journals} accountOptions={accountOptions} />;
}
