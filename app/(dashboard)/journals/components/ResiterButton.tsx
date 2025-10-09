'use client';
import { Button } from '@/components/ui/button';
import { useJournal } from '@/hooks/useJournal';

const RegisterButton = () => {
    const { openModal } = useJournal();
    return <Button onClick={openModal}>登録</Button>;
};

export default RegisterButton;
