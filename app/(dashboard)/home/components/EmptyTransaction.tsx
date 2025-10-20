import { ArrowUpRightIcon, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

export function EmptyTransaction() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FileText />
                </EmptyMedia>
                <EmptyTitle>取引がありません</EmptyTitle>
                <EmptyDescription>まずは最初の取引を登録しましょう。</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/journals">取引を登録する</Link>
                    </Button>
                </div>
            </EmptyContent>
            <Button variant="link" asChild className="text-muted-foreground" size="sm">
                <Link href="/help">
                    ヘルプページ <ArrowUpRightIcon />
                </Link>
            </Button>
        </Empty>
    );
}
