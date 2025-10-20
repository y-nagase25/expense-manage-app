import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function LedgerTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead className="text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                    </TableHead>
                    <TableHead className="text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                    </TableHead>
                    <TableHead className="text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                    </TableHead>
                    <TableHead className="text-right">
                        <Skeleton className="h-4 w-12 ml-auto" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }, (_, i) => `skeleton-row-${i}`).map((key) => (
                    <TableRow key={key}>
                        <TableCell className="font-medium">
                            <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell className="text-right">
                            <Skeleton className="h-4 w-20 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                            <Skeleton className="h-4 w-20 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                            <Skeleton className="h-4 w-20 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                            <Skeleton className="h-4 w-24 ml-auto" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
