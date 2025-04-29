import { User, AuthResponse, UpdateProfileData } from '../types';

export const login = async (identifier: string, password: string): Promise<AuthResponse> => {
    const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
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

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
    const token = getToken();
    if (!token) {
        throw new Error('Non authentifié');
    }

    const res = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
    }

    const updatedUser = await res.json();
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
};

export const uploadProfilePicture = async (file: File): Promise<string> => {
    const token = getToken();
    if (!token) {
        throw new Error('Non authentifié');
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:8080/api/user/profile-picture', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!res.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
    }

    const data = await res.json();
    
    // Mettre à jour le user dans le localStorage avec la nouvelle photo
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.profilePicture = data.profilePicture;
    localStorage.setItem('user', JSON.stringify(user));
    
    return data.profilePicture;
};

export const deleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Non authentifié');
    }

    const response = await fetch('http://localhost:8080/api/user/delete', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error (await response.text())
    
};