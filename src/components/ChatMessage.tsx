import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    ChatMessage as ChatMessageType,
} from '../types/chat';

import {
    colors,
    radius,
} from '../styles/theme';

interface ChatMessageProps {
    message: ChatMessageType;
    isOwnMessage: boolean;
}

function formatTime(
    timestamp: number
): string {
    return new Date(
        timestamp
    ).toLocaleTimeString(
        'pt-BR',
        {
            hour: '2-digit',
            minute: '2-digit',
        }
    );
}

export function ChatMessage({
    message,
    isOwnMessage,
}: ChatMessageProps) {
    return (
        <View
            style={[
                styles.row,

                isOwnMessage
                    ? styles.ownRow
                    : styles.receivedRow,
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
                        styles.text,

                        isOwnMessage
                            ? styles.ownText
                            : styles.receivedText,
                    ]}
                >
                    {message.text}
                </Text>

                <Text
                    style={[
                        styles.time,

                        isOwnMessage
                            ? styles.ownTime
                            : styles.receivedTime,
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
    row: {
        width: '100%',
        paddingHorizontal: 16,
        marginVertical: 4,
    },

    ownRow: {
        alignItems:
            'flex-end',
    },

    receivedRow: {
        alignItems:
            'flex-start',
    },

    bubble: {
        maxWidth: '78%',
        minWidth: 64,
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 8,
    },

    ownBubble: {
        backgroundColor:
            colors.sentMessage,
        borderRadius:
            radius.large,
        borderBottomRightRadius: 5,
    },

    receivedBubble: {
        backgroundColor:
            colors.receivedMessage,
        borderRadius:
            radius.large,
        borderBottomLeftRadius: 5,
    },

    text: {
        fontSize: 15,
        lineHeight: 21,
    },

    ownText: {
        color: '#FFFFFF',
    },

    receivedText: {
        color: colors.text,
    },

    time: {
        fontSize: 10,
        marginTop: 5,
        alignSelf: 'flex-end',
    },

    ownTime: {
        color: '#CBD5E1',
    },

    receivedTime: {
        color:
            colors.textSecondary,
    },
});