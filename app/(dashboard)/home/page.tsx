import { Suspense } from 'react';
import { getTransactionCounts } from '@/lib/loaders/journals';
import { createPageMetadata, PAGE_TITLES } from '@/lib/page-config';
import { BankBalance } from './components/BankBalance';
import { ChartAreaGradient } from './components/ChartAreaGradient';
import { EmptyTransaction } from './components/EmptyTransaction';
import {
    BankBalanceSkeleton,
    ChartAreaGradientSkeleton,
    RecentTransactionSkeleton,
} from './components/HomeSkeleton';
import { RecentTransactionTable } from './components/RecentTransactionTable';

export const metadata = createPageMetadata(PAGE_TITLES.HOME);

export default async function HomePage() {
    const transactionCounts = await getTransactionCounts();
    return (
        <div className="space-y-6 p-6">
            {transactionCounts === 0 ? (
                <EmptyTransaction />
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                        <div className="lg:col-span-2">
                            <Suspense fallback={<BankBalanceSkeleton />}>
                                <BankBalance />
                            </Suspense>
                        </div>
                        <div className="lg:col-span-8">
                            <Suspense fallback={<RecentTransactionSkeleton />}>
                                <RecentTransactionTable />
                            </Suspense>
                        </div>
                    </div>
                    <Suspense fallback={<ChartAreaGradientSkeleton />}>
                        <ChartAreaGradient />
                    </Suspense>
                </>
            )}
        </div>
    );
}
