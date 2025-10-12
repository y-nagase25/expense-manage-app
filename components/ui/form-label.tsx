import { HelpCircle } from 'lucide-react';
import type * as React from 'react';
import { Label } from './label';
import { RequiredBadge } from './required-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

type FormLabelProps = React.ComponentProps<typeof Label> & {
    /**
     * Whether the field is required
     * - true: Shows "必須" badge
     * - false: Shows "任意" badge
     * - undefined: No badge
     */
    required?: boolean;
    /**
     * Tooltip text to display on hover
     * If provided, shows a help icon with the tooltip
     */
    tooltip?: string;
};

/**
 * Form label component with required/optional badge and tooltip
 * Combines Label with RequiredBadge and optional Tooltip based on props
 *
 * @example
 * // Required field with tooltip
 * <FormLabel htmlFor="email" required tooltip="メールアドレスを入力してください">
 *   メールアドレス
 * </FormLabel>
 *
 * // Optional field with tooltip
 * <FormLabel htmlFor="description" required={false} tooltip="説明を入力してください">
 *   説明
 * </FormLabel>
 *
 * // No badge, with tooltip
 * <FormLabel htmlFor="name" tooltip="名前を入力してください">
 *   名前
 * </FormLabel>
 */
export function FormLabel({ children, required, tooltip, ...props }: FormLabelProps) {
    return (
        <Label {...props}>
            {children}
            {required === true && <RequiredBadge />}
            {/* {required === false && <OptionalBadge />} */}
            {tooltip && (
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger type="button" className="cursor-help">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </Label>
    );
}
