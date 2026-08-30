import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    onAuthStateChanged,
} from 'firebase/auth';

import { auth } from '../services/firebase';

import {
    getUserById,
} from '../services/userService';

import {
    logout as logoutService,
} from '../services/authService';

import { ChatUser } from '../types/user';

interface AuthContextData {
    user: ChatUser | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export const AuthContext =
    createContext<AuthContextData | undefined>(
        undefined
    );

interface AuthProviderProps {
    children: ReactNode;
}

function wait(
    milliseconds: number
): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

async function getUserWithRetry(
    uid: string,
    attempts = 10,
    delay = 150
): Promise<ChatUser | null> {
    for (
        let attempt = 1;
        attempt <= attempts;
        attempt += 1
    ) {
        const databaseUser =
            await getUserById(uid);

        if (databaseUser) {
            return databaseUser;
        }

        if (attempt < attempts) {
            await wait(delay);
        }
    }

    return null;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] =
        useState<ChatUser | null>(null);

    const [loading, setLoading] =
        useState<boolean>(true);

    const refreshUser =
        useCallback(async (): Promise<void> => {
            const firebaseUser =
                auth.currentUser;

            if (!firebaseUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const databaseUser =
                    await getUserWithRetry(
                        firebaseUser.uid
                    );

                if (!databaseUser) {
                    console.warn(
                        'Usuário autenticado não encontrado no Realtime Database.'
                    );

                    setUser(null);

                    return;
                }

                setUser(databaseUser);
            } catch (error) {
                console.error(
                    'Erro ao carregar usuário autenticado:',
                    error
                );

                setUser(null);

                throw error;
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        let active = true;

        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (firebaseUser) => {
                    if (!active) {
                        return;
                    }

                    setLoading(true);

                    try {
                        if (!firebaseUser) {
                            setUser(null);
                            return;
                        }

                        const databaseUser =
                            await getUserWithRetry(
                                firebaseUser.uid
                            );

                        if (!active) {
                            return;
                        }

                        if (!databaseUser) {
                            console.warn(
                                'Usuário autenticado não possui perfil no Realtime Database.'
                            );

                            setUser(null);

                            return;
                        }

                        setUser(databaseUser);
                    } catch (error) {
                        if (!active) {
                            return;
                        }

                        console.error(
                            'Erro no listener de autenticação:',
                            error
                        );

                        setUser(null);
                    } finally {
                        if (active) {
                            setLoading(false);
                        }
                    }
                }
            );

        return () => {
            active = false;
            unsubscribe();
        };
    }, []);

    const logout =
        useCallback(
            async (): Promise<void> => {
                try {
                    setLoading(true);

                    await logoutService();

                    setUser(null);
                } catch (error) {
                    console.error(
                        'Erro ao realizar logout:',
                        error
                    );

                    throw error;
                } finally {
                    setLoading(false);
                }
            },
            []
        );

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