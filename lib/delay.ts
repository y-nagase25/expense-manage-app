export async function addDelay(ms: number = 3000): Promise<void> {
    // 本番環境では遅延を追加しない
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    // 開発環境でのみ遅延を追加
    await new Promise((resolve) => setTimeout(resolve, ms));
}
