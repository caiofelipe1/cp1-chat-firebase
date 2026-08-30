import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import { useAuth } from './useAuth';

import {
    getOrCreateConversation,
    listenToMessages,
    sendChatMessage,
} from '../services/chatService';

import { ChatMessage } from '../types/chat';

interface UseChatResult {
    messages: ChatMessage[];
    loading: boolean;
    sending: boolean;
    error: string;
    sendMessage: (
        text: string
    ) => Promise<boolean>;
}

export function useChat(
    participantId: string
): UseChatResult {
    const { user } = useAuth();

    const currentUserId = user?.uid;

    const [conversationId, setConversationId] =
        useState<string | null>(null);

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [sending, setSending] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string>('');

    useEffect(() => {
        let unsubscribe:
            | (() => void)
            | null = null;

        let active = true;

        async function setupChat(): Promise<void> {
            if (!currentUserId) {
                if (active) {
                    setError(
                        'Usuário não autenticado.'
                    );
                    setLoading(false);
                }

                return;
            }

            try {
                setLoading(true);
                setError('');
                setMessages([]);

                const conversation =
                    await getOrCreateConversation(
                        currentUserId,
                        participantId
                    );

                if (!active) {
                    return;
                }

                setConversationId(
                    conversation.id
                );

                unsubscribe =
                    listenToMessages(
                        conversation.id,
                        (
                            updatedMessages
                        ) => {
                            if (!active) {
                                return;
                            }

                            setMessages(
                                updatedMessages
                            );

                            setLoading(false);
                        },
                        () => {
                            if (!active) {
                                return;
                            }

                            setError(
                                'Não foi possível acompanhar as mensagens em tempo real.'
                            );

                            setLoading(false);
                        }
                    );
            } catch {
                if (active) {
                    setError(
                        'Não foi possível abrir a conversa.'
                    );

                    setLoading(false);
                }
            }
        }

        void setupChat();

        return () => {
            active = false;

            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [
        currentUserId,
        participantId,
    ]);

    const sendMessage = useCallback(
        async (
            text: string
        ): Promise<boolean> => {
            if (
                !currentUserId ||
                !conversationId
            ) {
                setError(
                    'A conversa ainda não está disponível.'
                );

                return false;
            }

            const normalizedText =
                text.trim();

            if (!normalizedText) {
                return false;
            }

            try {
                setSending(true);
                setError('');

                await sendChatMessage({
                    conversationId,
                    senderId:
                        currentUserId,
                    receiverId:
                        participantId,
                    text: normalizedText,
                });

                return true;
            } catch {
                setError(
                    'Não foi possível enviar a mensagem.'
                );

                return false;
            } finally {
                setSending(false);
            }
        },
        [
            conversationId,
            currentUserId,
            participantId,
        ]
    );

    return {
        messages,
        loading,
        sending,
        error,
        sendMessage,
    };
}