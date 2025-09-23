type TagProps = {
    children?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

const Tag = ({ children, color = 'primary', ...props }: TagProps) => {
    const getColorClasses = (color: string) => {
        switch (color) {
            case 'primary':
                return 'bg-indigo-600';
            case 'secondary':
                return 'bg-gray-600';
            case 'success':
                return 'bg-green-600';
            case 'danger':
                return 'bg-red-600';
            case 'warning':
                return 'bg-yellow-600';
            default:
                return 'bg-indigo-600';
        }
    };

    return (
        <span
            className={`
                text-white inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${getColorClasses(color)}
            `}
            {...props}
        >
            {children}
        </span>
    );
}

export default Tag;