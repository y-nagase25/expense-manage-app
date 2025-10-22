import { createPageMetadata, PAGE_TITLES } from '@/lib/page-config';
import ConfirmForm from './components/ConfirmForm';

export const metadata = createPageMetadata(PAGE_TITLES.CONFIRM);

export default function ConfirmPage() {
    return <ConfirmForm />;
}
