import { User } from './auth.types';

export interface Post {
    id: number;
    title: string;
    content: string;
    category_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    user: User;
    category: Category;
    comments: Comment[];
    reactions: Reaction[];
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Comment {
    id: number;
    content: string;
    user: User;
    created_at: string;
    post_id: number;
}

export interface Reaction {
    id: number;
    user_id: number;
    post_id: number;
    like: boolean;
    created_at: string;
}
