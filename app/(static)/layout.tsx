import { StaticHeader } from '@/components/StaticHeader';

export default function StaticLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <StaticHeader />
            <div className="flex justify-center">
                <div className="w-full max-w-4xl p-6">{children}</div>
            </div>
        </>
    );
}
