import Tag from '@/app/components/common/Tag'
import { TransactionTypeLabel } from '@/app/types'
import { JournalEntry } from '@prisma/client'

const TransactionTypeTag = ({ entry }: { entry: JournalEntry }) => {
    return (
        <Tag color={entry.transactionType == 'INCOME' ? 'success' : 'danger'}>
            {TransactionTypeLabel[entry.transactionType]}
        </Tag>
    )
}

export default TransactionTypeTag;
