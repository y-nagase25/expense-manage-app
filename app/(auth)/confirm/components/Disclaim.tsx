import { AlertCircleIcon } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Disclaim() {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>ご利用前に必ずお読みください</AccordionTrigger>
                <AccordionContent>
                    <Alert variant="warning">
                        <AlertCircleIcon />
                        <AlertTitle>免責事項</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc text-xs">
                                <li>
                                    本アプリはポートフォリオ目的で作成されており、会計関連の法令に対応した正式なソフトウェアではありません。
                                </li>
                                <li>用語の使い方や計算結果の正確性は保証できません。</li>
                                <li>
                                    実務での会計処理には、専門家への相談または正式な会計ソフトの利用を推奨します。
                                </li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
