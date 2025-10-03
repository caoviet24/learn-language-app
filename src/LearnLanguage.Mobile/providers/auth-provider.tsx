import authService from '@/services/auth-service';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useEffect, useState } from 'react';

export interface AuthContextType {
    user: User | null;
    setUser?: React.Dispatch<React.SetStateAction<User | null>>;
    isGuest?: boolean;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    isSuccess?: boolean;
    isError?: boolean;
}

export const authContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    isGuest: false,
    isAuthenticated: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const { data, isLoading, isSuccess, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => authService.getMyInfo(),
        enabled: true,
        retry: false,
    });

    const isGuest = user === null;
    const isAuthenticated = user !== null;

    useEffect(() => {
        if (isSuccess && data) {
            setUser({
                ...data,
                activities: data.userActivities, 
            });
        } else if (isError) {
            setUser(null);
        }
    }, [isSuccess, isError, data]);

    return (
        <authContext.Provider
            value={{
                user,
                setUser,
                isGuest,
                isAuthenticated,
                isLoading,
                isSuccess,
                isError,
            }}
        >
            {children}
        </authContext.Provider>
    );
}
