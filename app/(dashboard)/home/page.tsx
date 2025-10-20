import { Suspense } from 'react';
import { BankBalance } from './components/BankBalance';
import { ChartAreaGradient } from './components/ChartAreaGradient';
import {
    BankBalanceSkeleton,
    ChartAreaGradientSkeleton,
    RecentTransactionSkeleton,
} from './components/HomeSkeleton';
import { RecentTransactionTable } from './components/RecentTransactionTable';

export default async function HomePage() {
    return (
        <div className="space-y-6 p-6">
            {/* PC: 2col, SP: 1col */}
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
            {/* 1col */}
            <Suspense fallback={<ChartAreaGradientSkeleton />}>
                <ChartAreaGradient />
            </Suspense>
        </div>
    );
}
