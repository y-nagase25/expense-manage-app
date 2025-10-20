import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function JournalTableSkeleton() {
    return (
        <>
            {/* Filter Area Skeleton */}
            <div className="mb-6 rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 gap-4 grid-cols-4">
                    {/* Transaction Type Filter */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Debit Account Filter */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Credit Account Filter */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Reset Button */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </div>

            {/* Table Area Skeleton */}
            <div className="rounded-lg border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Skeleton className="h-4 w-12" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-12" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                                <TableHead className="text-right">
                                    <Skeleton className="h-4 w-12 ml-auto" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-12" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-4 w-12" />
                                </TableHead>
                                <TableHead className="w-[100px]">
                                    <Skeleton className="h-4 w-12" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }, (_, i) => `skeleton-row-${i}`).map((key) => (
                                <TableRow key={key}>
                                    <TableCell>
                                        <Skeleton className="h-6 w-12" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-20 ml-auto" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-40" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end space-x-4">
                                            <Skeleton className="h-6 w-6" />
                                            <Skeleton className="h-6 w-6" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
