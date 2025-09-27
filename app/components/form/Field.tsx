import { FieldProps } from "@/app/types";

export const Field = ({ children, label, className }: FieldProps) => {
    return (
        <div className={`border rounded-md p-3 dark:border-gray-700 ${className}`}>
            <div className="text-sm text-gray-500 mb-1">{label}</div>
            <div className="text-gray-900 dark:text-gray-100 break-words">
                {children}
            </div>
        </div>
    );
}

export const SplitField = ({ field }: { field: FieldProps[] }) => {
    return (
        <div className="grid grid-cols-2 gap-4 border rounded-md p-3 dark:border-gray-700">
            {field.map(({ children, label }, i) => (
                <div key={i}>
                    <div className="text-sm text-gray-500 mb-1">{label}</div>
                    {children}
                </div>
            ))}
        </div>
    );
}