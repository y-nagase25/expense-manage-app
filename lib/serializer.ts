// lib/serializer.ts
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Prismaのオブジェクトをシリアライズ
 * - Date → ISO string
 * - Decimal → string
 * - ネストしたオブジェクトも再帰的に変換
 */
// biome-ignore lint/suspicious/noExplicitAny: 任意の型を受け取り、シリアライズ可能な形式に変換するため
export function serialize<T>(data: T): any {
    if (data === null || data === undefined) {
        return data;
    }

    if (data instanceof Date) {
        return data.toISOString();
    }

    if (data instanceof Decimal) {
        return data.toString();
    }

    if (Array.isArray(data)) {
        return data.map((item) => serialize(item));
    }

    if (typeof data === 'object') {
        // biome-ignore lint/suspicious/noExplicitAny: オブジェクトの再帰的なシリアライズのため動的な型が必要
        const serialized: any = {};
        for (const [key, value] of Object.entries(data)) {
            serialized[key] = serialize(value);
        }
        return serialized;
    }

    return data;
}
