"use client";
import { useEffect, useState } from 'react';
import { isAuthenticated, logout, getUser } from '@/services/auth';

export default function Navigation() {
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const auth = isAuthenticated();
        setAuthenticated(auth);
        if (auth) {
            const user = getUser();
            if (user) {
                setUsername(user.username);
            }
        }
    }, []);

    return (
        <nav>
            {authenticated ? (
                <>
                    <span>Bienvenue, {username}!</span>
                    <button onClick={logout}>Déconnexion</button>
                </>
            ) : (
                <>
                    <a href="/register">Inscription</a>
                    <a href="/login">Connexion</a>
                </>
            )}
        </nav>
    );
} 