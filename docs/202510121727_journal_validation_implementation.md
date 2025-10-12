# 仕訳登録・更新処理のサーバーサイドバリデーション実装

## 変更概要

仕訳の登録・更新処理にサーバーサイドバリデーションを追加し、ユーザーフレンドリーなエラー表示機能を実装。

## 実装内容

### 1. Zodバリデーションスキーマの作成

**ファイル**: `lib/validations/journal.ts` (新規作成)

- 金額: 必須、1〜8桁の数字（小数点以下2桁まで対応）
- 取引先: 必須、30文字まで
- 摘要: 任意、50文字まで
- 備考: 任意、255文字まで
- その他: すべて必須（日付、勘定科目、支払口座、税区分）

### 2. Server Actionsへのバリデーション追加

**ファイル**: `app/(dashboard)/journals/actions.ts`

- `createJournalEntry`: FormDataをZodスキーマで検証
- `updateJournalEntry`: FormDataをZodスキーマで検証
- バリデーションエラー時は`ZodError`をキャッチし、フィールドエラーを返却

### 3. 型定義の更新

**ファイル**: `lib/types/types.ts`

- `FormResponse`型に`errors?: Record<string, string[]>`を追加
- フィールドごとのエラーメッセージを含められるよう拡張

### 4. ValidationErrorsコンポーネントの作成

**ファイル**: `app/(dashboard)/journals/components/ValidationErrors.tsx` (新規作成)

- 再利用可能なClient Component
- バリデーションエラーを視認性良くリスト表示
- AlertCircleアイコンと赤色のスタイリングで注意喚起
- アクセシビリティ対応（`role="alert"`, `aria-live="polite"`）

### 5. フォームコンポーネントの更新

**ファイル**:
- `app/(dashboard)/journals/components/JournalModal.tsx`
- `app/(dashboard)/journals/[id]/journal-display.tsx`

変更点:
- `useRef`を使用して無限ループを防止
- ValidationErrorsコンポーネントを統合
- エラー時はトーストではなく専用エリアに表示
- 成功時のみトースト通知

## 技術的ポイント

### 無限ループの防止

`useActionState`の返却値である`state`オブジェクトが毎回新規生成されるため、`useEffect`の依存配列に含めると無限ループが発生。`useRef`で前回の`state`を記憶し、実際に変更があった場合のみ処理を実行。

```typescript
const prevStateRef = useRef<FormResponse>(initialState);

useEffect(() => {
    if (state === prevStateRef.current) return;
    // ... 処理 ...
    prevStateRef.current = state;
}, [state, ...]);
```

### バリデーションエラーのフォーマット

Zodの`error.flatten().fieldErrors`を使用してフィールドごとのエラーを取得し、フラット化してリスト表示。

## 影響範囲

- 仕訳登録フォーム（モーダル）
- 仕訳編集フォーム（詳細ページ）
- Server Actions（createJournalEntry, updateJournalEntry）

## テスト項目

- [ ] 必須フィールドが空の場合にバリデーションエラーが表示される
- [ ] 金額が9桁以上の場合にエラーが表示される
- [ ] 取引先が31文字以上の場合にエラーが表示される
- [ ] 摘要が51文字以上の場合にエラーが表示される
- [ ] 備考が256文字以上の場合にエラーが表示される
- [ ] 正常なデータで登録・更新が成功する
- [ ] エラー後に正常なデータで再送信できる
- [ ] 無限ループが発生しない
