'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import type { FormResponse } from '@/lib/types/types';
import { acceptTerms } from './actions';
import { Disclaim } from './components/Disclaim';

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
        <form action={formAction}>
            <FieldGroup>
                <FieldLegend>アカウント登録確認</FieldLegend>
                <FieldSet>
                    <Field>
                        <FieldLabel htmlFor="businessName">事業所名・屋号</FieldLabel>
                        <Input
                            id="businessName"
                            name="businessName"
                            placeholder="田中事務所"
                            defaultValue={state.field?.get('businessName')?.toString()}
                            disabled={isPending}
                        />
                        <FieldError>{state.errors?.businessName}</FieldError>
                    </Field>
                </FieldSet>
                <FieldSet>
                    <Disclaim />
                </FieldSet>
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
                        <Label htmlFor="termsAccepted" className="gap-0">
                            <Link href="/terms" target="_blank" className="underline">
                                利用規約
                            </Link>
                            と
                            <Link href="/privacy" target="_blank" className="underline">
                                プライバシーポリシー
                            </Link>
                            に同意する
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
    );
}
