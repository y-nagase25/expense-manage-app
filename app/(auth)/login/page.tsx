import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { createPageMetadata, PAGE_TITLES } from '@/lib/page-config';
import { LoginForm } from './components/LoginForm';

export const metadata = createPageMetadata(PAGE_TITLES.LOGIN);

const LoginPage = async () => {
    // Check if user is already authenticated
    const user = await getUser();

    if (user) {
        // User is logged in, redirect to home
        redirect('/home');
    }

    // User is not logged in, show login form
    return <LoginForm />;
};

export default LoginPage;
