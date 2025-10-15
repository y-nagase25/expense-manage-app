import { CheckIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatToJST } from '@/lib/format';
import { createServerSupabase } from '@/utils/supabase/server';
import { DeleteUserButton } from './components/DeleteUserButton';

const pageContent = {
    title: 'アカウント',
} as const;

export default async function ProfilePage() {
    const supabase = await createServerSupabase();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PageBreadcrumb
                items={[{ label: 'ホーム', href: '/home' }, { label: pageContent.title }]}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{pageContent.title}</h1>
            </div>
            <form>
                <FieldGroup>
                    <FieldSet>
                        <Field>
                            <FieldLabel className="flex items-center gap-2">
                                ログイン認証
                                <Label
                                    data-theme="green"
                                    className="flex size-4 items-center justify-center rounded-full data-[theme=green]:bg-green-600"
                                >
                                    <CheckIcon className="size-3 stroke-white peer-data-[state=checked]:block" />
                                </Label>
                            </FieldLabel>
                            <FieldDescription>
                                <GoogleIcon />
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="checkout-7j9-card-name-43j">ユーザ名</FieldLabel>
                            <FieldDescription>{user?.user_metadata.name}</FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                メールアドレス
                            </FieldLabel>
                            <FieldDescription>{user?.email}</FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="checkout-7j9-card-name-43j">登録日時</FieldLabel>
                            <FieldDescription>
                                {user.confirmed_at ? formatToJST(user.confirmed_at) : '未確認'}
                            </FieldDescription>
                        </Field>
                    </FieldSet>
                </FieldGroup>
                <Separator className="my-8" />
                <DeleteUserButton />
            </form>
        </div>
    );
}
