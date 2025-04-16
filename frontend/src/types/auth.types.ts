export interface User {
    id: number;
    username: string;
    email: string;
    profilePicture?: string;
    city?: string;
    age?: number;
    bio?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface UpdateProfileData {
    username?: string;
    email?: string;
    password?: string;
    city: string;
    age: number;
    bio: string;
}