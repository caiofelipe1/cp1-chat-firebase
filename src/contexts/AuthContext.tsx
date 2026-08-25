import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../services/firebase';
import { getUserById } from '../services/userService';
import { logout as logoutService } from '../services/authService';
import { ChatUser } from '../types/user';

interface AuthContextData {
    user: ChatUser | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<ChatUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const refreshUser = useCallback(async (): Promise<void> => {
        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {
            setUser(null);
            return;
        }

        const databaseUser = await getUserById(firebaseUser.uid);

        setUser(databaseUser);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {
                setLoading(true);

                try {
                    if (!firebaseUser) {
                        setUser(null);
                        return;
                    }

                    const databaseUser = await getUserById(
                        firebaseUser.uid
                    );

                    setUser(databaseUser);
                } catch {
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            }
        );

        return unsubscribe;
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        await logoutService();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}