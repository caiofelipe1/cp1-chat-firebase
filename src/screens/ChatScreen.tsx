import {
    useRef,
} from 'react';

import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

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

import {
    colors,
} from '../styles/theme';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'Chat'
    >;

export function ChatScreen({
    navigation,
    route,
}: Props) {
    const {
        participantId,
        participantName,
    } = route.params;

    const { user } =
        useAuth();

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
        <SafeAreaView
            style={styles.safeArea}
            edges={[
                'top',
                'left',
                'right',
            ]}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <View
                    style={
                        styles.header
                    }
                >
                    <Pressable
                        style={
                            styles.backButton
                        }
                        onPress={() =>
                            navigation.goBack()
                        }
                    >
                        <Text
                            style={
                                styles.backIcon
                            }
                        >
                            ‹
                        </Text>
                    </Pressable>

                    <View
                        style={
                            styles.avatar
                        }
                    >
                        <Text
                            style={
                                styles.avatarText
                            }
                        >
                            {participantName
                                .trim()
                                .slice(0, 1)
                                .toUpperCase()}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.headerContent
                        }
                    >
                        <Text
                            style={
                                styles.participantName
                            }
                            numberOfLines={1}
                        >
                            {
                                participantName
                            }
                        </Text>

                        <Text
                            style={
                                styles.status
                            }
                        >
                            Conversa privada •
                            1 para 1
                        </Text>
                    </View>
                </View>

                {error ? (
                    <View
                        style={
                            styles.errorWrapper
                        }
                    >
                        <ErrorMessage
                            message={
                                error
                            }
                        />
                    </View>
                ) : null}

                <FlatList
                    ref={
                        listReference
                    }
                    data={messages}
                    keyExtractor={(
                        item
                    ) => item.id}
                    renderItem={({
                        item,
                    }) => (
                        <ChatMessage
                            message={
                                item
                            }
                            isOwnMessage={
                                item.senderId ===
                                user?.uid
                            }
                        />
                    )}
                    contentContainerStyle={[
                        styles.messagesContent,

                        messages.length ===
                            0 &&
                            styles.emptyMessagesContent,
                    ]}
                    showsVerticalScrollIndicator={
                        false
                    }
                    ListEmptyComponent={
                        <View
                            style={
                                styles.emptyContainer
                            }
                        >
                            <View
                                style={
                                    styles.emptyAvatar
                                }
                            >
                                <Text
                                    style={
                                        styles.emptyAvatarText
                                    }
                                >
                                    {participantName
                                        .trim()
                                        .slice(
                                            0,
                                            1
                                        )
                                        .toUpperCase()}
                                </Text>
                            </View>

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                Comece a conversa
                            </Text>

                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                Envie a primeira
                                mensagem para{' '}
                                {
                                    participantName
                                }
                                .
                            </Text>
                        </View>
                    }
                    onContentSizeChange={() => {
                        listReference.current
                            ?.scrollToEnd({
                                animated:
                                    true,
                            });
                    }}
                />

                <ChatInput
                    onSend={
                        sendMessage
                    }
                    sending={sending}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor:
            colors.surface,
    },

    container: {
        flex: 1,
        backgroundColor:
            colors.background,
    },

    header: {
        minHeight: 72,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:
            colors.surface,
        borderBottomWidth: 1,
        borderBottomColor:
            colors.border,
        paddingHorizontal: 14,
        gap: 11,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent:
            'center',
        alignItems: 'center',
    },

    backIcon: {
        color: colors.text,
        fontSize: 38,
        lineHeight: 38,
        marginTop: -3,
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor:
            colors.primary,
        justifyContent:
            'center',
        alignItems: 'center',
    },

    avatarText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },

    headerContent: {
        flex: 1,
        minWidth: 0,
    },

    participantName: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },

    status: {
        color:
            colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },

    errorWrapper: {
        backgroundColor:
            colors.surface,
        paddingHorizontal: 16,
    },

    messagesContent: {
        width: '100%',
        maxWidth: 900,
        alignSelf: 'center',
        paddingTop: 12,
        paddingBottom: 10,
    },

    emptyMessagesContent: {
        flexGrow: 1,
    },

    emptyContainer: {
        flex: 1,
        justifyContent:
            'center',
        alignItems: 'center',
        padding: 30,
    },

    emptyAvatar: {
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor:
            colors.surface,
        borderWidth: 1,
        borderColor:
            colors.border,
        justifyContent:
            'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    emptyAvatarText: {
        color: colors.text,
        fontSize: 22,
        fontWeight: '800',
    },

    emptyTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
    },

    emptyText: {
        color:
            colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 7,
    },
});