import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// SQL クエリのログ設定
const logConfig =
    process.env.DEBUG_SQL === 'true'
        ? [
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
          ]
        : undefined;

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: logConfig,
    });

// クエリログの詳細出力（DEBUG_SQL=true の場合のみ）
if (process.env.DEBUG_SQL === 'true') {
    // @ts-expect-error - Prisma Client のイベント型定義の問題
    prisma.$on('query', (e) => {
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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
