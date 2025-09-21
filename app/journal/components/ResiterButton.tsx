"use client";
import { useJournal } from "@/hooks/useJournal";
import Button from "../../components/common/Button";


const RegisterButton = () => {
    const { openModal } = useJournal();
    return (
        <Button color="success" onClick={openModal}>
            Resister
        </Button>
    );
};

export default RegisterButton;