import { getMonthlyIncomeExpense } from '@/lib/loaders/journals';
import { ChartAreaGradientClient } from './ChartAreaGradientClient';

export async function ChartAreaGradient() {
    const chartData = await getMonthlyIncomeExpense();

    return <ChartAreaGradientClient chartData={chartData} />;
}
