import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBankAccountBalance } from '@/lib/loaders/journals';

export async function BankBalance() {
    const bankBalance = await getBankAccountBalance();
    return (
        <Card>
            <CardHeader>
                <CardTitle>銀行口座</CardTitle>
                <CardDescription>{bankBalance.toLocaleString()} 円</CardDescription>
            </CardHeader>
        </Card>
    );
}
