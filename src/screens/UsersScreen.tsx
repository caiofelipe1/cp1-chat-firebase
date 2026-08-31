import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
    useAuth,
} from '../hooks/useAuth';

import {
    getAllUsers,
} from '../services/userService';

import {
    ChatUser,
} from '../types/user';

import {
    RootStackParamList,
} from '../types/navigation';

import {
    canUsersChat,
} from '../utils/chatRules';

import {
    Loading,
} from '../components/Loading';

import {
    ErrorMessage,
} from '../components/ErrorMessage';

import {
    UserItem,
} from '../components/UserItem';

import {
    colors,
    radius,
} from '../styles/theme';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'Users'
    >;

export function UsersScreen({
    navigation,
}: Props) {
    const {
        user,
        logout,
    } = useAuth();

    const [users, setUsers] =
        useState<ChatUser[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string>('');

    const loadUsers =
        useCallback(
            async (): Promise<void> => {
                try {
                    setLoading(true);
                    setError('');

                    const databaseUsers =
                        await getAllUsers();

                    setUsers(
                        databaseUsers
                    );
                } catch {
                    setError(
                        'Não foi possível carregar os contatos.'
                    );
                } finally {
                    setLoading(false);
                }
            },
            []
        );

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    const compatibleUsers =
        useMemo(() => {
            if (!user) {
                return [];
            }

            return users.filter(
                (candidate) =>
                    canUsersChat(
                        user,
                        candidate
                    )
            );
        }, [
            user,
            users,
        ]);

    const handleUserPress =
        useCallback(
            (
                selectedUser: ChatUser
            ): void => {
                navigation.navigate(
                    'Chat',
                    {
                        participantId:
                            selectedUser.uid,

                        participantName:
                            selectedUser.name,
                    }
                );
            },
            [navigation]
        );

    const handleLogout =
        useCallback(
            async (): Promise<void> => {
                await logout();
            },
            [logout]
        );

    if (loading) {
        return <Loading />;
    }

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={[
                'top',
                'left',
                'right',
                'bottom',
            ]}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View
                        style={
                            styles.headerText
                        }
                    >
                        <Text
                            style={
                                styles.eyebrow
                            }
                        >
                            CHAT FIREBASE
                        </Text>

                        <Text
                            style={
                                styles.title
                            }
                        >
                            Contatos
                        </Text>

                        <Text
                            style={
                                styles.subtitle
                            }
                        >
                            Olá,{' '}
                            {user?.name ??
                                'usuário'}
                        </Text>
                    </View>

                    <Pressable
                        style={({
                            pressed,
                        }) => [
                            styles.logoutButton,

                            pressed &&
                                styles.logoutPressed,
                        ]}
                        onPress={() => {
                            void handleLogout();
                        }}
                    >
                        <Text
                            style={
                                styles.logoutText
                            }
                        >
                            Sair
                        </Text>
                    </Pressable>
                </View>

                <View
                    style={
                        styles.sectionHeader
                    }
                >
                    <View
                        style={
                            styles.sectionText
                        }
                    >
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Pessoas disponíveis
                        </Text>

                        <Text
                            style={
                                styles.sectionDescription
                            }
                        >
                            Apenas usuários
                            compatíveis com seu
                            login são exibidos.
                        </Text>
                    </View>

                    <View
                        style={
                            styles.counterBadge
                        }
                    >
                        <Text
                            style={
                                styles.counterText
                            }
                        >
                            {
                                compatibleUsers.length
                            }
                        </Text>
                    </View>
                </View>

                {error ? (
                    <ErrorMessage
                        message={error}
                    />
                ) : null}

                <FlatList
                    data={
                        compatibleUsers
                    }
                    keyExtractor={(
                        item
                    ) => item.uid}
                    renderItem={({
                        item,
                    }) => (
                        <UserItem
                            user={item}
                            onPress={
                                handleUserPress
                            }
                        />
                    )}
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={[
                        styles.listContent,

                        compatibleUsers.length ===
                            0 &&
                            styles.emptyList,
                    ]}
                    ListEmptyComponent={
                        <View
                            style={
                                styles.emptyContainer
                            }
                        >
                            <View
                                style={
                                    styles.emptyIcon
                                }
                            >
                                <Text
                                    style={
                                        styles.emptyIconText
                                    }
                                >
                                    C
                                </Text>
                            </View>

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                Nenhum contato
                                disponível
                            </Text>

                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                Não existem
                                usuários compatíveis
                                com seu tipo de
                                autenticação neste
                                momento.
                            </Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor:
            colors.background,
    },

    container: {
        flex: 1,
        width: '100%',
        maxWidth: 900,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:
            'space-between',
        paddingTop: 18,
        paddingBottom: 24,
        gap: 16,
    },

    headerText: {
        flex: 1,
        minWidth: 0,
    },

    eyebrow: {
        color:
            colors.textMuted,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 5,
    },

    title: {
        color: colors.text,
        fontSize: 30,
        fontWeight: '800',
    },

    subtitle: {
        color:
            colors.textSecondary,
        fontSize: 14,
        marginTop: 5,
    },

    logoutButton: {
        minHeight: 42,
        justifyContent:
            'center',
        paddingHorizontal: 18,
        backgroundColor:
            colors.primary,
        borderRadius:
            radius.medium,
    },

    logoutPressed: {
        backgroundColor:
            colors.primaryPressed,
    },

    logoutText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },

    sectionText: {
        flex: 1,
        minWidth: 0,
        paddingRight: 12,
    },

    sectionTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
    },

    sectionDescription: {
        color:
            colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        marginTop: 4,
    },

    counterBadge: {
        width: 34,
        height: 34,
        flexShrink: 0,
        borderRadius: 17,
        backgroundColor:
            colors.surface,
        borderWidth: 1,
        borderColor:
            colors.border,
        justifyContent:
            'center',
        alignItems: 'center',
    },

    counterText: {
        color: colors.text,
        fontSize: 13,
        fontWeight: '700',
    },

    listContent: {
        paddingBottom: 24,
    },

    emptyList: {
        flexGrow: 1,
    },

    emptyContainer: {
        flex: 1,
        justifyContent:
            'center',
        alignItems: 'center',
        padding: 30,
    },

    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor:
            colors.surface,
        borderWidth: 1,
        borderColor:
            colors.border,
        justifyContent:
            'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    emptyIconText: {
        color:
            colors.textMuted,
        fontWeight: '800',
        fontSize: 22,
    },

    emptyTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },

    emptyText: {
        color:
            colors.textSecondary,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        maxWidth: 340,
        marginTop: 8,
    },
});