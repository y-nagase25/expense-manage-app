import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfirmPage() {
    return (
        <FieldGroup>
            <FieldSet>
                <FieldLegend>アカウント登録確認</FieldLegend>
                <FieldDescription>
                    本アプリの利用には利用規約/プライバシーポリシーへの同意が必要です。
                </FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="businessname">事業所名・屋号</FieldLabel>
                        <Input id="businessname" placeholder="田中事務所" />
                    </Field>
                </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
                <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">利用規約・プライバシーポリシーに同意します</Label>
                </div>
            </FieldSet>
            <Field orientation="horizontal">
                <Button type="submit">アカウント登録</Button>
            </Field>
        </FieldGroup>
    );
}
