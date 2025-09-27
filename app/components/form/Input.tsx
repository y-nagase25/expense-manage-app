import { FormType } from "@/app/types";

type InputTextProps = {
    type?: FormType;
    id: string;
    name: string;
    defaultValue: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

// CC: value & onChange, SC: defaultValue
export const InputText = ({ type = 'text', id, name, defaultValue, ...props }: InputTextProps) => {
    return (
        <input
            type={type}
            id={id}
            name={name}
            defaultValue={defaultValue}
            className="mt-2 p-2 block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...props}
        />
    );
}

type InputSelectProps = {
    labelMap: Record<string, string>;
    id: string;
    name: string;
    defaultValue?: string;
};

export const InputSelect = ({ labelMap, id, name, defaultValue, ...props }: InputSelectProps) => {
    return (
        <select
            id={id}
            name={name}
            defaultValue={defaultValue}
            className="mt-2 p-2 block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...props}
        >
            {Object.entries(labelMap).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    );
}
