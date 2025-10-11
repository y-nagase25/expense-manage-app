// lib/serializer.ts
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Prismaのオブジェクトをシリアライズ
 * - Date → ISO string
 * - Decimal → string
 * - ネストしたオブジェクトも再帰的に変換
 */
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
        const serialized: any = {};
        for (const [key, value] of Object.entries(data)) {
            serialized[key] = serialize(value);
        }
        return serialized;
    }

    return data;
}
