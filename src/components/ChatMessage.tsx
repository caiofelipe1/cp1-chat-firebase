import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    ChatMessage as ChatMessageType,
} from '../types/chat';

interface ChatMessageProps {
    message: ChatMessageType;
    isOwnMessage: boolean;
}

function formatTime(
    timestamp: number
): string {
    const date = new Date(timestamp);

    const hours = String(
        date.getHours()
    ).padStart(2, '0');

    const minutes = String(
        date.getMinutes()
    ).padStart(2, '0');

    return `${hours}:${minutes}`;
}

export function ChatMessage({
    message,
    isOwnMessage,
}: ChatMessageProps) {
    return (
        <View
            style={[
                styles.container,
                isOwnMessage
                    ? styles.ownContainer
                    : styles.receivedContainer,
            ]}
        >
            <View
                style={[
                    styles.bubble,
                    isOwnMessage
                        ? styles.ownBubble
                        : styles.receivedBubble,
                ]}
            >
                <Text
                    style={[
                        styles.message,
                        isOwnMessage &&
                            styles.ownMessage,
                    ]}
                >
                    {message.text}
                </Text>

                <Text
                    style={[
                        styles.time,
                        isOwnMessage &&
                            styles.ownTime,
                    ]}
                >
                    {formatTime(
                        message.createdAt
                    )}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        paddingHorizontal: 16,
    },

    ownContainer: {
        alignItems: 'flex-end',
    },

    receivedContainer: {
        alignItems: 'flex-start',
    },

    bubble: {
        maxWidth: '80%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
    },

    ownBubble: {
        backgroundColor: '#111111',
    },

    receivedBubble: {
        backgroundColor: '#e6e6e6',
    },

    message: {
        fontSize: 16,
        color: '#111111',
    },

    ownMessage: {
        color: '#ffffff',
    },

    time: {
        fontSize: 11,
        color: '#666666',
        marginTop: 4,
        alignSelf: 'flex-end',
    },

    ownTime: {
        color: '#cccccc',
    },
});