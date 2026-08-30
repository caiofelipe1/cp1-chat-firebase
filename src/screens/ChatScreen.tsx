import {
    useRef,
} from 'react';

import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';

import {
    RootStackParamList,
} from '../types/navigation';

import {
    ChatMessage as ChatMessageType,
} from '../types/chat';

import {
    ChatMessage,
} from '../components/ChatMessage';

import {
    ChatInput,
} from '../components/ChatInput';

import {
    ErrorMessage,
} from '../components/ErrorMessage';

import {
    Loading,
} from '../components/Loading';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'Chat'
    >;

export function ChatScreen({
    route,
}: Props) {
    const {
        participantId,
        participantName,
    } = route.params;

    const { user } = useAuth();

    const {
        messages,
        loading,
        sending,
        error,
        sendMessage,
    } = useChat(
        participantId
    );

    const listReference =
        useRef<
            FlatList<ChatMessageType>
        >(null);

    if (loading) {
        return <Loading />;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === 'ios'
                    ? 'padding'
                    : undefined
            }
            keyboardVerticalOffset={90}
        >
            <View style={styles.chatHeader}>
                <Text style={styles.name}>
                    {participantName}
                </Text>

                <Text style={styles.status}>
                    Conversa 1 para 1
                </Text>
            </View>

            {error ? (
                <ErrorMessage
                    message={error}
                />
            ) : null}

            <FlatList
                ref={listReference}
                data={messages}
                keyExtractor={(
                    item
                ) => item.id}
                renderItem={({
                    item,
                }) => (
                    <ChatMessage
                        message={item}
                        isOwnMessage={
                            item.senderId ===
                            user?.uid
                        }
                    />
                )}
                contentContainerStyle={[
                    styles.messagesContent,
                    messages.length === 0 &&
                        styles.emptyMessagesContent,
                ]}
                ListEmptyComponent={
                    <View
                        style={
                            styles.emptyContainer
                        }
                    >
                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            Nenhuma mensagem ainda
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            Envie a primeira
                            mensagem para{' '}
                            {participantName}.
                        </Text>
                    </View>
                }
                onContentSizeChange={() => {
                    listReference.current
                        ?.scrollToEnd({
                            animated: true,
                        });
                }}
            />

            <ChatInput
                onSend={sendMessage}
                sending={sending}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    chatHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },

    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    status: {
        marginTop: 2,
        fontSize: 12,
        color: '#777777',
    },

    messagesContent: {
        paddingVertical: 12,
    },

    emptyMessagesContent: {
        flexGrow: 1,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    emptyText: {
        marginTop: 8,
        color: '#666666',
        textAlign: 'center',
    },
});