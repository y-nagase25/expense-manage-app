/**
 * UTCの日付を日本時間に変換してフォーマットする
 * @param date UTC基準のDateまたはISO文字列
 * @param withSeconds 秒を表示するか (default: true)
 * @returns "YYYY-MM-DD HH:mm[:ss]"
 */
export function formatToJST(date: Date | string, withSeconds: boolean = true): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    // 日本時間に変換するためオフセットを適用
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const jst = new Date(utc + 9 * 60 * 60000);

    const year = jst.getFullYear();
    const month = String(jst.getMonth() + 1).padStart(2, '0');
    const day = String(jst.getDate()).padStart(2, '0');
    const hour = String(jst.getHours()).padStart(2, '0');
    const minute = String(jst.getMinutes()).padStart(2, '0');
    const second = String(jst.getSeconds()).padStart(2, '0');

    return withSeconds
        ? `${year}-${month}-${day} ${hour}:${minute}:${second}`
        : `${year}-${month}-${day} ${hour}:${minute}`;
}

/**
 * 現在の日本時間を取得する
 */
export function nowJST(withSeconds: boolean = true): string {
    return formatToJST(new Date(), withSeconds);
}

export function formatCurrency(n: number) {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(n);
}

/**
 * 金額を日本円フォーマットで表示する
 * @param amount 金額（数値または文字列）
 * @returns フォーマットされた金額文字列
 */
export function formatAmount(amount: number | string): string {
    const num = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
    }).format(num);
}

/**
 * 日付をYYYY-MM-DD形式でフォーマットする
 * @param date 日付（Dateまたは文字列）
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

/**
 * 残高を会計記法でフォーマットする（マイナスは括弧表記）
 * @param balance 残高文字列
 * @returns フォーマットされた残高文字列
 */
export function formatBalance(balance: string): string {
    const num = Number.parseFloat(balance);
    if (num < 0) {
        return `(${formatAmount(Math.abs(num))})`;
    }
    return formatAmount(num);
}
