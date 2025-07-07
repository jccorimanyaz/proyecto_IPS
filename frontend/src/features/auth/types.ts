export interface User {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'inspector' | 'citizen';
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean | null;
    loading: boolean;
    error: string | null;
    access: string | null;
    refresh: string | null;
}