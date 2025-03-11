interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        throw new Error('Erreur de connexion');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
};

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    if (!res.ok) {
        throw new Error('Erreur d\'inscription');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const getUser = (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
}; 