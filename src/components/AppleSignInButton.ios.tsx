import {
    useEffect,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import * as AppleAuthentication from 'expo-apple-authentication';

interface AppleSignInButtonProps {
    onPress: () => void;
    disabled: boolean;
    loading: boolean;
}

export function AppleSignInButton({
    onPress,
    disabled,
    loading,
}: AppleSignInButtonProps) {
    const [
        available,
        setAvailable,
    ] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        let active = true;

        async function checkAvailability(): Promise<void> {
            try {
                const isAvailable =
                    await AppleAuthentication
                        .isAvailableAsync();

                if (active) {
                    setAvailable(
                        isAvailable
                    );
                }
            } catch {
                if (active) {
                    setAvailable(false);
                }
            }
        }

        void checkAvailability();

        return () => {
            active = false;
        };
    }, []);

    if (!available) {
        return (
            <Pressable
                style={[
                    styles.fallbackButton,
                    styles.disabled,
                ]}
                disabled
            >
                <Text>
                    Entrar com Apple
                </Text>
            </Pressable>
        );
    }

    return (
        <View
            style={[
                styles.wrapper,
                disabled &&
                    styles.disabled,
            ]}
            pointerEvents={
                disabled
                    ? 'none'
                    : 'auto'
            }
        >
            <AppleAuthentication
                .AppleAuthenticationButton
                buttonType={
                    AppleAuthentication
                        .AppleAuthenticationButtonType
                        .SIGN_IN
                }
                buttonStyle={
                    AppleAuthentication
                        .AppleAuthenticationButtonStyle
                        .BLACK
                }
                cornerRadius={10}
                style={
                    styles.appleButton
                }
                onPress={onPress}
            />

            {loading ? (
                <View
                    style={
                        styles.loadingOverlay
                    }
                    pointerEvents="none"
                >
                    <ActivityIndicator
                        color="#ffffff"
                    />
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: 48,
        position: 'relative',
    },

    appleButton: {
        width: '100%',
        height: 48,
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },

    fallbackButton: {
        minHeight: 48,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    disabled: {
        opacity: 0.5,
    },
});