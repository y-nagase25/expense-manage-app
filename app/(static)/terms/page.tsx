const pageContent = {
    title: '利用規約',
} as const;

export default function TermsPage() {
    return (
        <>
            <h1 className="text-2xl font-bold">{pageContent.title}</h1>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
                第1条（適用）
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                本利用規約（以下「本規約」といいます）は、本サービスの利用に関する条件を定めるものです。ユーザーは、本サービスを利用することにより、本規約に同意したものとみなされます。
            </p>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                第2条（本サービスの目的）
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                本サービスは、ポートフォリオ提示を目的として作成されたアプリケーションです。本サービスは商用サービスではなく、学習目的で提供されるものであり、業務利用や商用利用を想定していません。
            </p>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                第3条（アカウント登録）
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                ユーザーは、Google
                OAuth認証を通じて本サービスにアカウント登録を行います。ユーザーは、登録情報が正確かつ最新であることを保証する責任を負います。
            </p>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                第4条（個人情報の取り扱い）
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                本サービスは、Google OAuth認証を通じて以下の情報を取得します：
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>メールアドレス</li>
                <li>氏名</li>
                <li>プロフィール画像</li>
            </ul>
            <p className="[&:not(:first-child)]:mt-6">
                取得した個人情報は、本サービスの提供目的にのみ使用され、第三者に提供されることはありません。
            </p>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                第5条（サービス内容）
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                本サービスは、ユーザーに対して以下の機能を提供します：
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>収支記録の作成・編集・削除</li>
                <li>取引履歴の一覧表示・検索</li>
                <li>仕訳データの管理</li>
            </ul>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                第6条（ユーザーの責任）
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                ユーザーは、本サービスを通じて入力・保存するデータの管理について、自らの責任において行うものとします。本サービスは、データの完全性や永続性を保証するものではありません。重要なデータについては、ユーザー自身でバックアップを取得することを強く推奨します。
            </p>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                第7条（禁止事項）
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                ユーザーは、本サービスの利用にあたり、以下の行為を行ってはならないものとします：
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>他のユーザーまたは第三者の権利を侵害する行為</li>
                <li>本サービスのセキュリティを脅かす行為</li>
                <li>不正アクセス、過度なリクエスト送信などのシステムに負荷をかける行為</li>
                <li>その他、運営者が不適切と判断する行為</li>
            </ul>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                第8条（免責事項）
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                本サービスは、ポートフォリオ目的であり、以下の点について一切の保証を行いません：
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>サービスの可用性、安定性、継続性</li>
                <li>データの完全性、正確性、永続性</li>
                <li>特定の目的への適合性</li>
            </ul>
            <p className="[&:not(:first-child)]:mt-6">
                運営者は、本サービスの利用によってユーザーに生じた損害について、一切の責任を負いません。ユーザーは、本サービスを自己の責任において利用するものとします。
            </p>

            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                第9条（サービスの変更・停止）
            </h2>
            <p className="[&:not(:first-child)]:mt-6">
                運営者は、ユーザーへの事前通知なく、本サービスの内容の変更、追加、または本サービスの提供の停止・中断を行うことができるものとします。これによりユーザーに生じた損害について、運営者は一切の責任を負いません。
            </p>

            <p className="[&:not(:first-child)]:mt-6 text-muted-foreground">
                制定日：2025年10月1日
            </p>
        </>
    );
}
