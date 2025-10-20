'use client';

import { AlertCircle } from 'lucide-react';

type ValidationErrorsProps = {
    errors?: Record<string, string[]>;
    className?: string;
};

/**
 * Validation errors display component
 * Shows validation error messages in a visually clear format
 */
export function ValidationErrors({ errors, className = '' }: ValidationErrorsProps) {
    if (!errors || Object.keys(errors).length === 0) {
        return null;
    }

    // Flatten all error messages from all fields
    const errorMessages = Object.entries(errors).flatMap(([_, messages]) => messages);

    if (errorMessages.length === 0) {
        return null;
    }

    return (
        <div
            className={`bg-destructive/10 border border-destructive/30 rounded-lg p-4 ${className}`}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="font-medium text-destructive mb-2">入力内容に誤りがあります</h3>
                    <ul className="space-y-1 text-sm text-destructive/90">
                        {errorMessages.map((message) => (
                            <li key={message} className="flex items-start gap-2">
                                <span className="text-destructive/60 select-none">•</span>
                                <span>{message}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
