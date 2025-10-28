//เจมส์ : เพิ่ม file เก็บ global state ของ user
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
    user_id: string;
    username: string;
    user_email: string;
    user_fullname: string;
    user_birthdate: string;
    user_image: string;
    user_type_id: string;
    user_org_id: string;
    user_status_id: string;
    user_created_at: string;
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    login: (userData: UserData) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData: UserData) => {
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
        // console.log(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_data');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);