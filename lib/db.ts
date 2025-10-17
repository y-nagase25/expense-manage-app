import { PrismaClient } from '@prisma/client';
import { debugLogConfig, logQuery } from './debug';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const logConfig = process.env.DEBUG_SQL === 'true' ? debugLogConfig : undefined;

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: logConfig,
    });

// クエリログの詳細出力（DEBUG_SQL=true の場合のみ）
if (process.env.DEBUG_SQL === 'true') {
    logQuery(prisma);
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
