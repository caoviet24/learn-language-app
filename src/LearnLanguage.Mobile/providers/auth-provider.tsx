import { User } from "@/types";
import React, { createContext } from "react";

export interface AuthContextType {
    user: User | null;
    isGuest?: boolean;
    isAuthenticated?: boolean;
}

export const authContext = createContext({
    user: null,
    isGuest: false,
    isAuthenticated: false,
})

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <authContext.Provider value={{ 
            user: null,
            isGuest: false,
            isAuthenticated: false
        }}>
            {children}
        </authContext.Provider>
    )
}
