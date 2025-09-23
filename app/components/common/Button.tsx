type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

const Button = ({ children, color = 'primary', className, ...props }: ButtonProps) => {
    const getColorClasses = (color: string) => {
        switch (color) {
            case 'primary':
                return 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
            case 'secondary':
                return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
            case 'success':
                return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
            case 'danger':
                return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
            case 'warning':
                return 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500';
            default:
                return 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
        }
    };

    return (
        <button
            className={`
                flex items-center px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition
                ${getColorClasses(color)} ${className ?? ''}
            `}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;