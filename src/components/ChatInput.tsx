import {
    useState,
} from 'react';

import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

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
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Digite uma mensagem..."
                editable={!sending}
            />

            <Pressable
                style={[
                    styles.button,
                    disabled &&
                        styles.disabledButton,
                ]}
                disabled={disabled}
                onPress={() => {
                    void handleSend();
                }}
            >
                <Text style={styles.buttonText}>
                    {sending
                        ? 'Enviando...'
                        : 'Enviar'}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#dddddd',
        backgroundColor: '#ffffff',
    },

    input: {
        flex: 1,
        minHeight: 44,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 16,
    },

    button: {
        minHeight: 44,
        justifyContent: 'center',
        marginLeft: 8,
        paddingHorizontal: 18,
        borderRadius: 10,
        backgroundColor: '#111111',
    },

    disabledButton: {
        opacity: 0.5,
    },

    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});