import { useState } from 'react';

import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
    RootStackParamList,
} from '../types/navigation';

import {
    getAuthErrorMessage,
    registerWithEmailAndPassword,
} from '../services/authService';

import { useAuth } from '../hooks/useAuth';

import {
    colors,
    radius,
} from '../styles/theme';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'Register'
    >;

export function RegisterScreen({
    navigation,
}: Props) {
    const { refreshUser } =
        useAuth();

    const [name, setName] =
        useState<string>('');

    const [email, setEmail] =
        useState<string>('');

    const [password, setPassword] =
        useState<string>('');

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState<string>('');

    const [error, setError] =
        useState<string>('');

    const [loading, setLoading] =
        useState<boolean>(false);

    async function handleRegister(): Promise<void> {
        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError(
                'Preencha todos os campos.'
            );

            return;
        }

        if (password.length < 6) {
            setError(
                'A senha precisa ter pelo menos 6 caracteres.'
            );

            return;
        }

        if (
            password !== confirmPassword
        ) {
            setError(
                'As senhas não são iguais.'
            );

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

            await refreshUser();
        } catch (registerError) {
            setError(
                getAuthErrorMessage(
                    registerError
                )
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={
                        styles.scrollContent
                    }
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={styles.logo}>
                                <Text style={styles.logoText}>
                                    C
                                </Text>
                            </View>

                            <Text style={styles.title}>
                                Crie sua conta
                            </Text>

                            <Text style={styles.subtitle}>
                                Preencha seus dados para
                                começar a conversar.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <View>
                                <Text style={styles.label}>
                                    Nome
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Seu nome"
                                    placeholderTextColor={
                                        colors.textMuted
                                    }
                                    value={name}
                                    onChangeText={setName}
                                    editable={!loading}
                                    autoCapitalize="words"
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    E-mail
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="seu@email.com"
                                    placeholderTextColor={
                                        colors.textMuted
                                    }
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={email}
                                    onChangeText={setEmail}
                                    editable={!loading}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Senha
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Mínimo de 6 caracteres"
                                    placeholderTextColor={
                                        colors.textMuted
                                    }
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    editable={!loading}
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Confirmar senha
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite novamente"
                                    placeholderTextColor={
                                        colors.textMuted
                                    }
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={
                                        setConfirmPassword
                                    }
                                    editable={!loading}
                                    onSubmitEditing={() => {
                                        void handleRegister();
                                    }}
                                />
                            </View>

                            {error ? (
                                <View
                                    style={
                                        styles.errorContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.errorText
                                        }
                                    >
                                        {error}
                                    </Text>
                                </View>
                            ) : null}

                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,

                                    pressed &&
                                        styles.buttonPressed,

                                    loading &&
                                        styles.disabledButton,
                                ]}
                                onPress={() => {
                                    void handleRegister();
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        color="#FFFFFF"
                                    />
                                ) : (
                                    <Text
                                        style={
                                            styles.buttonText
                                        }
                                    >
                                        Criar conta
                                    </Text>
                                )}
                            </Pressable>

                            <View style={styles.loginRow}>
                                <Text
                                    style={
                                        styles.loginDescription
                                    }
                                >
                                    Já possui uma conta?
                                </Text>

                                <Pressable
                                    onPress={() =>
                                        navigation.goBack()
                                    }
                                    disabled={loading}
                                >
                                    <Text
                                        style={
                                            styles.loginAction
                                        }
                                    >
                                        Entrar
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },

    keyboardContainer: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },

    content: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
    },

    header: {
        alignItems: 'center',
        marginBottom: 28,
    },

    logo: {
        width: 54,
        height: 54,
        borderRadius: 17,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    logoText: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: '800',
    },

    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
    },

    subtitle: {
        color: colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        marginTop: 8,
    },

    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        padding: 22,
        gap: 16,
    },

    label: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 7,
    },

    input: {
        minHeight: 50,
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.medium,
        paddingHorizontal: 14,
        color: colors.text,
        fontSize: 16,
    },

    errorContainer: {
        backgroundColor: colors.errorBackground,
        borderRadius: radius.medium,
        paddingHorizontal: 14,
        paddingVertical: 11,
    },

    errorText: {
        color: colors.error,
        fontSize: 14,
        textAlign: 'center',
    },

    button: {
        minHeight: 50,
        backgroundColor: colors.primary,
        borderRadius: radius.medium,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonPressed: {
        backgroundColor: colors.primaryPressed,
    },

    disabledButton: {
        opacity: 0.55,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    loginRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 5,
    },

    loginDescription: {
        color: colors.textSecondary,
        fontSize: 14,
    },

    loginAction: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },
});