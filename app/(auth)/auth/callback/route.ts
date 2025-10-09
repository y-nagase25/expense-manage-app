import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const errorCode = searchParams.get('error_code');
    const next = searchParams.get('next') ?? '/';

    // Handle OAuth provider errors
    if (error) {
        console.error('OAuth callback error:', {
            error,
            errorCode,
            errorDescription,
        });

        // Redirect to login with error details
        const loginUrl = new URL('/login', origin);
        loginUrl.searchParams.set('error', error);
        if (errorDescription) {
            loginUrl.searchParams.set('error_description', errorDescription);
        }
        if (errorCode) {
            loginUrl.searchParams.set('error_code', errorCode);
        }
        return NextResponse.redirect(loginUrl);
    }

    if (code) {
        try {
            const supabase = await createServerSupabase();
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
                console.error('Error exchanging code for session:', {
                    message: exchangeError.message,
                    name: exchangeError.name,
                    status: exchangeError.status,
                });

                // Redirect to login with error info
                const loginUrl = new URL('/login', origin);
                loginUrl.searchParams.set('error', 'exchange_failed');
                loginUrl.searchParams.set('error_description', exchangeError.message);
                return NextResponse.redirect(loginUrl);
            }

            if (data.session) {
                console.log('Successfully created session for user:', data.user?.email);

                const forwardedHost = request.headers.get('x-forwarded-host');
                const isLocalEnv = process.env.NODE_ENV === 'development';

                if (isLocalEnv) {
                    return NextResponse.redirect(`${origin}${next}`);
                } else if (forwardedHost) {
                    return NextResponse.redirect(`https://${forwardedHost}${next}`);
                } else {
                    return NextResponse.redirect(`${origin}${next}`);
                }
            }
        } catch (error) {
            console.error('Unexpected error during code exchange:', error);

            const loginUrl = new URL('/login', origin);
            loginUrl.searchParams.set('error', 'unexpected_error');
            loginUrl.searchParams.set(
                'error_description',
                'An unexpected error occurred during authentication'
            );
            return NextResponse.redirect(loginUrl);
        }
    }

    // No code or error in the URL
    console.warn('Auth callback called without code or error parameter');
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('error', 'missing_code');
    loginUrl.searchParams.set(
        'error_description',
        'Authentication callback missing required parameters'
    );
    return NextResponse.redirect(loginUrl);
}
