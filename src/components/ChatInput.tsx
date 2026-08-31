import {
    useState,
} from 'react';

import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
    colors,
    radius,
} from '../styles/theme';

interface ChatInputProps {
    onSend: (
        text: string
    ) => Promise<boolean>;

    sending: boolean;
}

export function ChatInput({
    onSend,
    sending,
}: ChatInputProps) {
    const [text, setText] =
        useState<string>('');

    const insets =
        useSafeAreaInsets();

    async function handleSend(): Promise<void> {
        const normalizedText =
            text.trim();

        if (
            !normalizedText ||
            sending
        ) {
            return;
        }

        const success =
            await onSend(
                normalizedText
            );

        if (success) {
            setText('');
        }
    }

    const disabled =
        sending ||
        text.trim().length === 0;

    return (
        <View
            style={[
                styles.wrapper,

                {
                    paddingBottom:
                        Math.max(
                            insets.bottom,
                            10
                        ),
                },
            ]}
        >
            <View
                style={
                    styles.container
                }
            >
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Digite uma mensagem..."
                    placeholderTextColor={
                        colors.textMuted
                    }
                    editable={!sending}
                    multiline
                    maxLength={1000}
                    returnKeyType="send"
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                        if (
                            text.trim()
                                .length > 0
                        ) {
                            void handleSend();
                        }
                    }}
                />

                <Pressable
                    style={({ pressed }) => [
                        styles.button,

                        pressed &&
                            !disabled &&
                            styles.buttonPressed,

                        disabled &&
                            styles.disabledButton,
                    ]}
                    disabled={disabled}
                    onPress={() => {
                        void handleSend();
                    }}
                >
                    {sending ? (
                        <ActivityIndicator
                            color="#FFFFFF"
                        />
                    ) : (
                        <Text
                            style={
                                styles.buttonText
                            }
                        >
                            Enviar
                        </Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor:
            colors.surface,
        borderTopWidth: 1,
        borderTopColor:
            colors.border,
        paddingTop: 10,
        paddingHorizontal: 12,
    },

    container: {
        width: '100%',
        maxWidth: 900,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },

    input: {
        flex: 1,
        minHeight: 46,
        maxHeight: 120,
        backgroundColor:
            colors.inputBackground,
        borderWidth: 1,
        borderColor:
            colors.border,
        borderRadius:
            radius.large,
        paddingHorizontal: 15,
        paddingTop: 12,
        paddingBottom: 12,
        color: colors.text,
        fontSize: 15,
    },

    button: {
        minHeight: 46,
        minWidth: 74,
        borderRadius:
            radius.large,
        backgroundColor:
            colors.primary,
        justifyContent:
            'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },

    buttonPressed: {
        backgroundColor:
            colors.primaryPressed,
    },

    disabledButton: {
        backgroundColor:
            colors.disabled,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});