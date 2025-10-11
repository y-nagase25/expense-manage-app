import type { TransactionType } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { TransactionTypeLabel } from '@/lib/types/types';

const TransactionTypeTag = ({ transactionType }: { transactionType: TransactionType }) => {
    return (
        <Badge variant={transactionType === 'INCOME' ? 'success' : 'destructive'}>
            {TransactionTypeLabel[transactionType]}
        </Badge>
    );
};

export default TransactionTypeTag;
