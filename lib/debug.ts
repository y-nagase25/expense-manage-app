import type { Prisma, PrismaClient } from '@prisma/client';

/**
 * クエリをラップして実行時間とデータサマリーを表示
 *
 * @param queryName - クエリの名前（識別用）
 * @param queryFn - 実行するクエリ関数
 * @returns クエリの実行結果
 *
 * @example
 * ```ts
 * const journals = await debugQuery('getJournals', async () => {
 *   return await prisma.journal.findMany({
 *     where: { userId },
 *     include: { account: true }
 *   });
 * });
 * ```
 */
export async function debugQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    options?: {
        /** データサマリーを表示するかどうか（デフォルト: true） */
        showSummary?: boolean;
        /** クエリの説明 */
        description?: string;
    }
): Promise<T> {
    const startTime = performance.now();

    console.log('\n🔍 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎯 Query: ${queryName}`);
    if (options?.description) {
        console.log(`📄 Description: ${options.description}`);
    }
    console.log('⏱️  Starting...');

    try {
        const result = await queryFn();
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        console.log(`✅ Completed in ${duration}ms`);

        // データサマリーの表示
        if (options?.showSummary !== false) {
            if (Array.isArray(result)) {
                console.log(`📊 Result: Array with ${result.length} items`);
                if (result.length > 0) {
                    console.log(`📦 First item keys: ${Object.keys(result[0]).join(', ')}`);
                }
            } else if (result && typeof result === 'object') {
                console.log(`📊 Result: Object`);
                console.log(`📦 Keys: ${Object.keys(result).join(', ')}`);
            } else {
                console.log(`📊 Result: ${result}`);
            }
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        return result;
    } catch (error) {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        console.error(`❌ Failed after ${duration}ms`);
        console.error(`💥 Error: ${error instanceof Error ? error.message : String(error)}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        throw error;
    }
}

/**
 * 複数のクエリをまとめて実行し、パフォーマンスレポートを表示
 *
 * @param queries - 実行するクエリの配列
 * @returns 各クエリの実行結果の配列
 *
 * @example
 * ```ts
 * const [journals, accounts] = await debugQueryBatch([
 *   { name: 'getJournals', fn: () => prisma.journal.findMany() },
 *   { name: 'getAccounts', fn: () => prisma.account.findMany() }
 * ]);
 * ```
 */
export async function debugQueryBatch<T extends unknown[]>(
    queries: Array<{
        name: string;
        fn: () => Promise<unknown>;
        description?: string;
    }>
): Promise<T> {
    console.log('\n🔍 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎯 Batch Query: ${queries.length} queries`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const startTime = performance.now();
    const results: unknown[] = [];

    for (const query of queries) {
        const result = await debugQuery(query.name, query.fn, {
            description: query.description,
            showSummary: true,
        });
        results.push(result);
    }

    const endTime = performance.now();
    const totalDuration = (endTime - startTime).toFixed(2);

    console.log('\n📊 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Batch Completed in ${totalDuration}ms`);
    console.log(`📈 Average per query: ${(Number(totalDuration) / queries.length).toFixed(2)}ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return results as T;
}

/**
 * クエリのパフォーマンスを測定（結果は表示せず時間のみ）
 *
 * @param queryFn - 実行するクエリ関数
 * @returns クエリの実行結果と実行時間
 */
export async function measureQuery<T>(
    queryFn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    return { result, duration };
}

// ===========================================
// lib/db.ts
// ===========================================

// SQL クエリのログ設定
export const debugLogConfig = [
    {
        emit: 'event' as const,
        level: 'query' as const,
    },
    {
        emit: 'stdout' as const,
        level: 'info' as const,
    },
    {
        emit: 'stdout' as const,
        level: 'warn' as const,
    },
    {
        emit: 'stdout' as const,
        level: 'error' as const,
    },
];

// クエリログの出力関数
export function logQuery(prisma: PrismaClient): void {
    // biome-ignore lint/suspicious/noExplicitAny: narrow Prisma's event typing when log config is dynamic
    (prisma as any).$on('query', (e: Prisma.QueryEvent) => {
        // トランザクション制御や設定系のクエリは除外
        const excludePatterns = [
            /^BEGIN$/i,
            /^COMMIT$/i,
            /^ROLLBACK$/i,
            /^SET\s+/i,
            /^SHOW\s+/i,
            /^DEALLOCATE\s+/i,
            /^SELECT\s+1$/i, // ヘルスチェック
        ];

        const shouldExclude = excludePatterns.some((pattern) => pattern.test(e.query));

        if (shouldExclude) {
            return; // このクエリはログに出力しない
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Prisma Query Log');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`⏱️  Duration: ${e.duration}ms`);
        console.log(`🎯 Target: ${e.target}`);
        console.log(`📝 Query:\n${e.query}`);
        if (e.params && e.params !== '[]') {
            console.log(`📦 Params: ${e.params}`);
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });
}
