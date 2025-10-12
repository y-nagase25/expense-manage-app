import { cn } from '@/lib/utils';
import { Badge } from './badge';

type RequiredBadgeProps = {
    className?: string;
};

/**
 * Required field badge component
 * Displays a red "必須" badge for required form fields
 */
export function RequiredBadge({ className }: RequiredBadgeProps) {
    return (
        <Badge variant="secondary" className={cn('text-destructive', className)}>
            必須
        </Badge>
    );
}

type OptionalBadgeProps = {
    className?: string;
};

/**
 * Optional field badge component
 * Displays a gray "任意" badge for optional form fields
 */
export function OptionalBadge({ className }: OptionalBadgeProps) {
    return (
        <Badge variant="secondary" className={className}>
            任意
        </Badge>
    );
}
