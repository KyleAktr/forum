"use client";
import { useState } from 'react';
import { register } from '@/services/auth';

export default function Register() {
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            await register(
                formData.get('username') as string,
                formData.get('email') as string,
                formData.get('password') as string
            );
            window.location.href = '/login';
        } catch {
            setError('Erreur lors de l\'inscription');
        }
    };

    return (
        <div>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                {error && <div style={{color: 'red'}}>{error}</div>}
                <div>
                    <input name="username" type="text" placeholder="Username" required />
                </div>
                <div>
                    <input name="email" type="email" placeholder="Email" required />
                </div>
                <div>
                    <input name="password" type="password" placeholder="Password" required />
                </div>
                <button type="submit">S&apos;inscrire</button>
            </form>
        </div>
    );
} 