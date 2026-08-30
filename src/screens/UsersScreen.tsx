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

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../hooks/useAuth';

import { getAllUsers } from '../services/userService';

import { ChatUser } from '../types/user';
import { RootStackParamList } from '../types/navigation';

import { canUsersChat } from '../utils/chatRules';

import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { UserItem } from '../components/UserItem';

type Props = NativeStackScreenProps<
    RootStackParamList,
    'Users'
>;

export function UsersScreen({
    navigation,
}: Props) {
    const { user, logout } = useAuth();

    const [users, setUsers] =
        useState<ChatUser[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string>('');

    const loadUsers =
        useCallback(async (): Promise<void> => {
            try {
                setLoading(true);
                setError('');

                const databaseUsers =
                    await getAllUsers();

                setUsers(databaseUsers);
            } catch {
                setError(
                    'Não foi possível carregar os contatos.'
                );
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    const compatibleUsers = useMemo(() => {
        if (!user) {
            return [];
        }

        return users.filter((candidate) =>
            canUsersChat(user, candidate)
        );
    }, [user, users]);

    const handleUserPress = useCallback(
        (selectedUser: ChatUser): void => {
            navigation.navigate('Chat', {
                participantId: selectedUser.uid,
                participantName: selectedUser.name,
            });
        },
        [navigation]
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>
                        Contatos
                    </Text>

                    <Text style={styles.subtitle}>
                        Olá, {user?.name}
                    </Text>
                </View>

                <Pressable
                    style={styles.logoutButton}
                    onPress={logout}
                >
                    <Text style={styles.logoutText}>
                        Sair
                    </Text>
                </Pressable>
            </View>

            {error ? (
                <ErrorMessage message={error} />
            ) : null}

            <FlatList
                data={compatibleUsers}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => (
                    <UserItem
                        user={item}
                        onPress={handleUserPress}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyTitle}>
                            Nenhum contato disponível
                        </Text>

                        <Text style={styles.emptyText}>
                            Não existem usuários compatíveis
                            com seu tipo de autenticação.
                        </Text>
                    </View>
                }
                contentContainerStyle={
                    compatibleUsers.length === 0
                        ? styles.emptyList
                        : undefined
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },

    subtitle: {
        marginTop: 4,
        color: '#666666',
    },

    logoutButton: {
        backgroundColor: '#111111',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
    },

    logoutText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },

    emptyList: {
        flexGrow: 1,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    emptyText: {
        color: '#666666',
        textAlign: 'center',
        marginTop: 8,
    },
});