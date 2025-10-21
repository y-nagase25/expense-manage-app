const pageContent = {
    title: 'プライバシーポリシー',
} as const;

export default function PrivacyPolicyPage() {
    return (
        <>
            <h1 className="text-2xl font-bold">{pageContent.title}</h1>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
                1. 基本方針
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                本サービス（以下「当サービス」といいます）は、ユーザーの個人情報保護を重要な責務と認識し、個人情報保護法その他の関連法令を遵守するとともに、以下のプライバシーポリシー（以下「本ポリシー」といいます）に従い、適切な取り扱いと保護に努めます。
            </p>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                2. 取得する個人情報
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                当サービスは、ユーザーから以下の個人情報を取得します：
            </p>

            <h3 className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
                2.1 Google OAuth認証による情報
            </h3>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>メールアドレス</li>
                <li>氏名</li>
                <li>プロフィール画像URL</li>
                <li>GoogleアカウントID</li>
            </ul>

            <h3 className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
                2.2 サービス利用時に生成される情報
            </h3>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>ユーザーが作成した経費・収支データ</li>
                <li>仕訳データ（勘定科目、金額、日付、摘要など）</li>
                <li>サービス利用履歴（アクセス日時、操作ログなど）</li>
            </ul>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                3. 個人情報の利用目的
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                当サービスは、取得した個人情報を以下の目的で利用します：
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>ユーザー認証およびアカウント管理</li>
                <li>当サービスの提供、維持、改善</li>
                <li>利用規約違反への対応</li>
                <li>サービスの不正利用の防止および検知</li>
            </ul>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                4. 個人情報の第三者提供
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません：
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>
                    人の生命、身体または財産の保護のために必要であり、ユーザーの同意を得ることが困難である場合
                </li>
            </ul>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                5. 個人情報の管理・保護
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                当サービスは、個人情報への不正アクセス、紛失、破壊、改ざん、漏洩などを防止するため、合理的な安全対策を講じます。ただし、商用サービスレベルのセキュリティ体制を保証するものではありません。
            </p>
            <p className="[&:not(:first-child)]:mt-6">個人情報の管理体制：</p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>認証基盤：Supabase Auth（Google OAuth）を使用</li>
                <li>データベース：PostgreSQL（Supabase）による管理</li>
                <li>通信：HTTPS通信による暗号化</li>
            </ul>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                6. Cookie・トラッキング技術
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                当サービスは、ユーザー認証およびセッション管理のためにCookieを使用します。Cookieには以下の情報が含まれる場合があります：
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>セッション識別子</li>
                <li>認証トークン</li>
                <li>ユーザー設定情報</li>
            </ul>
            <p className="[&:not(:first-child)]:mt-6">
                ブラウザの設定によりCookieを無効化することも可能ですが、その場合、当サービスの一部機能が正常に動作しない可能性があります。
            </p>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                7. ユーザーの権利
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                ユーザーは、自己の個人情報について、以下の権利を有します：
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>利用停止請求：個人情報の利用停止または削除を求める権利</li>
                <li>アカウント削除：アカウントおよび関連する個人情報の削除を求める権利</li>
            </ul>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                8. プライバシーポリシーの変更
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                当サービスは、本ポリシーを予告なく変更することがあります。変更後のプライバシーポリシーは、本ページに掲載された時点で効力を生じるものとします。
            </p>

            <p className="[&:not(:first-child)]:mt-6 text-muted-foreground">
                制定日：2025年10月1日
            </p>
        </>
    );
}
