"use client";
import { useState } from 'react';
import { login } from '@/services/auth';

export default function Login() {
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            await login(
                formData.get('email') as string,
                formData.get('password') as string
            );
            window.location.href = '/';
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        }
    };

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                {error && <div style={{color: 'red'}}>{error}</div>}
                <div>
                    <input name="email" type="email" placeholder="Email" required />
                </div>
                <div>
                    <input name="password" type="password" placeholder="Password" required />
                </div>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
} 