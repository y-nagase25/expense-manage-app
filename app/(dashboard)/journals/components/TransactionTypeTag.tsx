import type { Journal } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { TransactionTypeLabel } from '@/lib/types';

const TransactionTypeTag = ({ journal }: { journal: Journal }) => {
    return (
        <Badge variant={journal.type === 'INCOME' ? 'success' : 'destructive'}>
            {TransactionTypeLabel[journal.type]}
        </Badge>
    );
};

export default TransactionTypeTag;
