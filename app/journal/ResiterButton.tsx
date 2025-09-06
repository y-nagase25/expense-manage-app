"use client";
import { PlusIcon } from "../components/icons/icons";

type RegisterButtonProps = {
    onOpen: () => void;
};

const RegisterButton = ({ onOpen }: RegisterButtonProps) => {
    return (
        <button
            onClick={onOpen}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            新規登録
        </button>
    );
};

export default RegisterButton;