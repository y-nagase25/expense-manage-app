import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">事業支出ダッシュボード</h1>
            <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    FE
                </div>
            </div>
        </header>
    );
};

export default Header;
