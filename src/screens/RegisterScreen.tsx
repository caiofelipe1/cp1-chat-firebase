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
    registerWithEmailAndPassword,
} from '../services/authService';

type Props = NativeStackScreenProps<
    RootStackParamList,
    'Register'
>;

export function RegisterScreen({
    navigation,
}: Props) {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] =
        useState<string>('');

    const [error, setError] = useState<string>('');
    const [loading, setLoading] =
        useState<boolean>(false);

    async function handleRegister(): Promise<void> {
        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError('Preencha todos os campos.');
            return;
        }

        if (password.length < 6) {
            setError(
                'A senha precisa ter pelo menos 6 caracteres.'
            );
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não são iguais.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await registerWithEmailAndPassword(
                name,
                email,
                password
            );
        } catch (registerError) {
            setError(
                getAuthErrorMessage(registerError)
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Criar conta
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
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

            <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : null}

            <Pressable
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <Text style={styles.buttonText}>
                        Criar conta
                    </Text>
                )}
            </Pressable>

            <Pressable
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.back}>
                    Já possui conta? Entrar
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
        fontSize: 28,
        fontWeight: 'bold',
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

    error: {
        color: '#b00020',
    },

    back: {
        textAlign: 'center',
        marginTop: 8,
    },
});