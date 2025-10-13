import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { LoginForm } from './components/LoginForm';

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
