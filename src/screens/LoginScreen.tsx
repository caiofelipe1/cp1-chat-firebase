import { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import {
    getAuthErrorMessage,
    loginWithEmailAndPassword,
} from '../services/authService';

type Props = NativeStackScreenProps<
    RootStackParamList,
    'Login'
>;

export function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    async function handleLogin(): Promise<void> {
        if (!email.trim() || !password) {
            setError('Preencha o e-mail e a senha.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await loginWithEmailAndPassword(
                email,
                password
            );
        } catch (loginError) {
            setError(getAuthErrorMessage(loginError));
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat Firebase</Text>

            <Text style={styles.subtitle}>
                Entre na sua conta
            </Text>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : null}

            <Pressable
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                )}
            </Pressable>

            <Pressable
                onPress={() =>
                    navigation.navigate('Register')
                }
            >
                <Text style={styles.register}>
                    Ainda não possui conta? Cadastre-se
                </Text>
            </Pressable>

            <View style={styles.divider}>
                <Text>ou</Text>
            </View>

            <Pressable
                style={styles.providerButton}
                disabled
            >
                <Text>Entrar com Google</Text>
            </Pressable>

            <Pressable
                style={styles.providerButton}
                disabled
            >
                <Text>Entrar com Apple</Text>
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
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },

    button: {
        backgroundColor: '#111111',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },

    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },

    register: {
        textAlign: 'center',
        marginTop: 8,
    },

    error: {
        color: '#b00020',
    },

    divider: {
        alignItems: 'center',
        marginVertical: 4,
    },

    providerButton: {
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        opacity: 0.5,
    },
});