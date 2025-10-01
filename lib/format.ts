/**
 * UTCの日付を日本時間に変換してフォーマットする
 * @param date UTC基準のDateまたはISO文字列
 * @param withSeconds 秒を表示するか (default: true)
 * @returns "YYYY-MM-DD HH:mm[:ss]"
 */
export function formatToJST(
    date: Date | string,
    withSeconds: boolean = true
): string {
    const d = typeof date === "string" ? new Date(date) : date;

    // 日本時間に変換するためオフセットを適用
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const jst = new Date(utc + 9 * 60 * 60000);

    const year = jst.getFullYear();
    const month = String(jst.getMonth() + 1).padStart(2, "0");
    const day = String(jst.getDate()).padStart(2, "0");
    const hour = String(jst.getHours()).padStart(2, "0");
    const minute = String(jst.getMinutes()).padStart(2, "0");
    const second = String(jst.getSeconds()).padStart(2, "0");

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
    return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(n);
}
