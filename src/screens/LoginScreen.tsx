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
    loginWithEmailAndPassword,
} from '../services/authService';

import {
    loginWithGoogle,
} from '../services/googleAuth';

import {
    loginWithApple,
} from '../services/appleAuth';

import {
    AppleSignInButton,
} from '../components/AppleSignInButton';

import { useAuth } from '../hooks/useAuth';

import {
    colors,
    radius,
} from '../styles/theme';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'Login'
    >;

export function LoginScreen({
    navigation,
}: Props) {
    const { refreshUser } =
        useAuth();

    const [email, setEmail] =
        useState<string>('');

    const [password, setPassword] =
        useState<string>('');

    const [error, setError] =
        useState<string>('');

    const [loading, setLoading] =
        useState<boolean>(false);

    const [
        googleLoading,
        setGoogleLoading,
    ] = useState<boolean>(false);

    const [
        appleLoading,
        setAppleLoading,
    ] = useState<boolean>(false);

    async function handleLogin(): Promise<void> {
        if (
            !email.trim() ||
            !password
        ) {
            setError(
                'Preencha o e-mail e a senha.'
            );

            return;
        }

        try {
            setLoading(true);
            setError('');

            await loginWithEmailAndPassword(
                email,
                password
            );

            await refreshUser();
        } catch (loginError) {
            setError(
                getAuthErrorMessage(
                    loginError
                )
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin(): Promise<void> {
        try {
            setGoogleLoading(true);
            setError('');

            await loginWithGoogle();

            await refreshUser();
        } catch (googleError) {
            setError(
                getAuthErrorMessage(
                    googleError
                )
            );
        } finally {
            setGoogleLoading(false);
        }
    }

    async function handleAppleLogin(): Promise<void> {
        try {
            setAppleLoading(true);
            setError('');

            await loginWithApple();

            await refreshUser();
        } catch (appleError) {
            setError(
                getAuthErrorMessage(
                    appleError
                )
            );
        } finally {
            setAppleLoading(false);
        }
    }

    const authenticationInProgress =
        loading ||
        googleLoading ||
        appleLoading;

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
                        <View style={styles.brand}>
                            <View style={styles.logo}>
                                <Text style={styles.logoText}>
                                    C
                                </Text>
                            </View>

                            <Text style={styles.title}>
                                Chat Firebase
                            </Text>

                            <Text style={styles.subtitle}>
                                Converse em tempo real,
                                de forma simples e segura.
                            </Text>
                        </View>

                        <View style={styles.card}>
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
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    editable={
                                        !authenticationInProgress
                                    }
                                />
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Senha
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor={
                                        colors.textMuted
                                    }
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    editable={
                                        !authenticationInProgress
                                    }
                                    onSubmitEditing={() => {
                                        void handleLogin();
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
                                    styles.primaryButton,

                                    pressed &&
                                        styles.primaryButtonPressed,

                                    authenticationInProgress &&
                                        styles.disabledButton,
                                ]}
                                onPress={() => {
                                    void handleLogin();
                                }}
                                disabled={
                                    authenticationInProgress
                                }
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        color="#FFFFFF"
                                    />
                                ) : (
                                    <Text
                                        style={
                                            styles.primaryButtonText
                                        }
                                    >
                                        Entrar
                                    </Text>
                                )}
                            </Pressable>

                            <View style={styles.registerRow}>
                                <Text
                                    style={
                                        styles.registerDescription
                                    }
                                >
                                    Ainda não possui conta?
                                </Text>

                                <Pressable
                                    onPress={() =>
                                        navigation.navigate(
                                            'Register'
                                        )
                                    }
                                    disabled={
                                        authenticationInProgress
                                    }
                                >
                                    <Text
                                        style={
                                            styles.registerAction
                                        }
                                    >
                                        Cadastre-se
                                    </Text>
                                </Pressable>
                            </View>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />

                                <Text style={styles.dividerText}>
                                    ou continue com
                                </Text>

                                <View style={styles.dividerLine} />
                            </View>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.googleButton,

                                    pressed &&
                                        styles.providerPressed,

                                    authenticationInProgress &&
                                        styles.disabledButton,
                                ]}
                                disabled={
                                    authenticationInProgress
                                }
                                onPress={() => {
                                    void handleGoogleLogin();
                                }}
                            >
                                {googleLoading ? (
                                    <ActivityIndicator
                                        color={
                                            colors.primary
                                        }
                                    />
                                ) : (
                                    <>
                                        <View
                                            style={
                                                styles.googleIcon
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.googleIconText
                                                }
                                            >
                                                G
                                            </Text>
                                        </View>

                                        <Text
                                            style={
                                                styles.googleButtonText
                                            }
                                        >
                                            Entrar com Google
                                        </Text>
                                    </>
                                )}
                            </Pressable>

                            <AppleSignInButton
                                onPress={() => {
                                    void handleAppleLogin();
                                }}
                                disabled={
                                    authenticationInProgress
                                }
                                loading={
                                    appleLoading
                                }
                            />
                        </View>

                        <Text style={styles.footer}>
                            CP1 • React Native + Firebase
                        </Text>
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

    brand: {
        alignItems: 'center',
        marginBottom: 28,
    },

    logo: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    logoText: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '800',
    },

    title: {
        color: colors.text,
        fontSize: 30,
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

    primaryButton: {
        minHeight: 50,
        borderRadius: radius.medium,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    primaryButtonPressed: {
        backgroundColor: colors.primaryPressed,
    },

    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    disabledButton: {
        opacity: 0.55,
    },

    registerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 5,
    },

    registerDescription: {
        color: colors.textSecondary,
        fontSize: 14,
    },

    registerAction: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 2,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },

    dividerText: {
        color: colors.textMuted,
        fontSize: 12,
    },

    googleButton: {
        minHeight: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.medium,
        backgroundColor: colors.googleBackground,
    },

    providerPressed: {
        backgroundColor: colors.inputBackground,
    },

    googleButtonText: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '600',
    },

    googleIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },

    googleIconText: {
        color: colors.text,
        fontWeight: '800',
        fontSize: 13,
    },

    footer: {
        color: colors.textMuted,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 22,
    },
});