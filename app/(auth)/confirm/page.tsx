'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import type { FormResponse } from '@/lib/types/types';
import { acceptTerms } from './actions';

const initialState: FormResponse = {
    success: false,
    message: '',
};

export default function ConfirmPage() {
    const { showToast } = useToast();
    const [state, formAction, isPending] = useActionState(acceptTerms, initialState);
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Handle form submission result
    useEffect(() => {
        if (state.success) {
            // Success: redirect is handled by the server action
            return;
        }

        if (state.message && !state.success) {
            // Error: show error toast
            showToast('error', state.message);
        }
    }, [state, showToast]);

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <form action={formAction}>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>アカウント登録確認</FieldLegend>
                        <FieldDescription>
                            本アプリの利用には利用規約・プライバシーポリシーへの同意が必要です。
                        </FieldDescription>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="businessName">事業所名・屋号</FieldLabel>
                                <Input
                                    id="businessName"
                                    name="businessName"
                                    placeholder="田中事務所"
                                    defaultValue={state.field?.get('businessName')?.toString()}
                                    disabled={isPending}
                                    required
                                />
                                <FieldError>{state.errors?.businessName}</FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="termsAccepted"
                                name="termsAccepted"
                                checked={termsAccepted}
                                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                                disabled={isPending}
                                value={termsAccepted ? 'true' : 'false'}
                            />
                            <Label htmlFor="termsAccepted">
                                利用規約・プライバシーポリシーに同意します
                            </Label>
                        </div>
                        <FieldError>{state.errors?.termsAccepted}</FieldError>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit" disabled={isPending || !termsAccepted}>
                            {isPending ? '登録中...' : 'アカウント登録'}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
}
