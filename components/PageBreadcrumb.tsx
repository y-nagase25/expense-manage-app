'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export type BreadcrumbItemType = {
    label: string;
    href?: string;
};

type Props = {
    items: BreadcrumbItemType[];
    className?: string;
};

/**
 * ページ階層を表示する汎用的なパンくずリストコンポーネント
 *
 * @param items - パンくずリストのアイテム配列。最後のアイテムは現在のページとして扱われます
 * @param className - 追加のCSSクラス
 *
 * @example
 * ```tsx
 * <PageBreadcrumb
 *   items={[
 *     { label: 'ホーム', href: '/' },
 *     { label: '仕訳一覧', href: '/journals' },
 *     { label: '仕訳詳細' },
 *   ]}
 * />
 * ```
 */
export function PageBreadcrumb({ items, className }: Props) {
    if (items.length === 0) {
        return null;
    }

    return (
        <Breadcrumb className={cn('mb-4', className)}>
            <BreadcrumbList>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <div key={`${item.label}-${index}`} className="contents">
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={item.href ?? '#'}>
                                        {item.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
