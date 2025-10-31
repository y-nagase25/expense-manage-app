import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function BankBalanceSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-5 w-32" />
            </CardHeader>
        </Card>
    );
}

export function ChartAreaGradientSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-7 w-24" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-48" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[400px] w-full" />
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export function RecentTransactionSkeleton() {
    return (
        <Table>
            <TableCaption>
                <Skeleton className="h-4 w-48 mx-auto" />
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Skeleton className="h-4 w-12" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead className="text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">
                        <Skeleton className="h-6 w-12" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-4 w-24 ml-auto" />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}
