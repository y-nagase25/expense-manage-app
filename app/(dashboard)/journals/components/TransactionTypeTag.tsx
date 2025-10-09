import type { JournalEntry } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { TransactionTypeLabel } from '@/lib/types';

const TransactionTypeTag = ({ entry }: { entry: JournalEntry }) => {
    return (
        <Badge variant={entry.transactionType === 'INCOME' ? 'success' : 'destructive'}>
            {TransactionTypeLabel[entry.transactionType]}
        </Badge>
    );
};

export default TransactionTypeTag;
