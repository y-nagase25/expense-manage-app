'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { MonthlyData } from '@/lib/loaders/journals';

const chartConfig = {
    income: {
        label: '収入',
        theme: {
            light: 'oklch(0.5 0.15 160)', // 緑（ライトモード）
            dark: 'oklch(0.65 0.15 160)', // 明るい緑（ダークモード）
        },
    },
    expense: {
        label: '支出',
        theme: {
            light: 'oklch(0.577 0.245 27.325)', // 赤（ライトモード）
            dark: 'oklch(0.704 0.191 22.216)', // 明るい赤（ダークモード）
        },
    },
} satisfies ChartConfig;

type ChartAreaGradientClientProps = {
    chartData: MonthlyData[];
};

export function ChartAreaGradientClient({ chartData }: ChartAreaGradientClientProps) {
    // Get month range for footer
    const startMonth = chartData[0]?.month || '';
    const endMonth = chartData[chartData.length - 1]?.month || '';

    return (
        <Card>
            <CardHeader>
                <CardTitle>収支推移</CardTitle>
                <CardDescription>直近6ヶ月の収入と支出の推移</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[240px] aspect-auto w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => {
                                const [, month] = value.split('-');
                                return `${month}月`;
                            }}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <defs>
                            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-income)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-income)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-expense)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-expense)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="expense"
                            type="natural"
                            fill="url(#fillExpense)"
                            fillOpacity={0.4}
                            stroke="var(--color-expense)"
                            stackId="a"
                        />
                        <Area
                            dataKey="income"
                            type="natural"
                            fill="url(#fillIncome)"
                            fillOpacity={0.4}
                            stroke="var(--color-income)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            {startMonth} 〜 {endMonth}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
