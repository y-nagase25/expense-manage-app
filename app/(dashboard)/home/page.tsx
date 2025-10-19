import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    getBankAccountBalance,
    getMonthlyIncomeExpense,
    getRecentTransactions,
} from '@/lib/loaders/journals';
import { ChartAreaGradient } from './ChartAreaGradient';
import { EmptyTransaction } from './EmptyTransaction';
import { RecentTransactionTable } from './recentTransaction';

export default async function HomePage() {
    const monthlyData = await getMonthlyIncomeExpense();
    const bankBalance = await getBankAccountBalance();
    const recentTransactions = await getRecentTransactions();

    return (
        <div className="space-y-6 p-6">
            {recentTransactions.length === 0 ? (
                <EmptyTransaction />
            ) : (
                <>
                    {/* PC: 2col, SP: 1col */}
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>銀行口座</CardTitle>
                                    <CardDescription>
                                        {bankBalance.toLocaleString()} 円
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className="lg:col-span-8">
                            <RecentTransactionTable transactions={recentTransactions} />
                        </div>
                    </div>
                    {/* 1col */}
                    <ChartAreaGradient chartData={monthlyData} />
                </>
            )}
        </div>
    );
}
