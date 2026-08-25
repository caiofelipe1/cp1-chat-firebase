import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAuth } from '../hooks/useAuth';

export function UsersScreen() {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Login realizado!
            </Text>

            <Text>
                Nome: {user?.name}
            </Text>

            <Text>
                E-mail: {user?.email}
            </Text>

            <Text>
                Provider: {user?.provider}
            </Text>

            <Text>
                UID: {user?.uid}
            </Text>

            <Pressable
                style={styles.button}
                onPress={logout}
            >
                <Text style={styles.buttonText}>
                    Sair
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        gap: 12,
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },

    button: {
        marginTop: 20,
        backgroundColor: '#111111',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },

    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});