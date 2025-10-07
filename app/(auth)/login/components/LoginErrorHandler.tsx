"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const ERROR_MESSAGES: Record<string, string> = {
    'server_error': 'サーバーエラーが発生しました',
    'unexpected_failure': 'データベースエラーが発生しました。Supabaseの設定を確認してください。',
    'exchange_failed': '認証トークンの交換に失敗しました',
    'missing_code': '認証パラメータが不足しています',
    'unexpected_error': '予期しないエラーが発生しました',
};

type LoginErrorHandlerProps = {
    showToast: (type: "error", message: string, description?: string) => void;
}

export function LoginErrorHandler({ showToast }: LoginErrorHandlerProps) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const errorCode = searchParams.get('error_code');

        if (error) {
            const message = ERROR_MESSAGES[error] || ERROR_MESSAGES[errorCode || ''] || 'ログインに失敗しました';
            const description = errorDescription || '';
            showToast('error', message, description);
        }

    }, [searchParams, showToast]);

    return null; // Not display UI
}
