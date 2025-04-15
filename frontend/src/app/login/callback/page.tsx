'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenAndUser = searchParams.get('data');
        if (!tokenAndUser) {
            console.error('No data found in URL');
            router.push('/login');
            return;
        }

        try {
            const decoded = decodeURIComponent(tokenAndUser);
            const data = JSON.parse(decoded);
            
            if (!data.token) {
                throw new Error('No token in response');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/');
        } catch (error) {
            console.error('Error parsing data:', error);
            router.push('/login');
        }
    }, [router, searchParams]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Redirection en cours...</p>
        </div>
    );
}
