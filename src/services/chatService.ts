import {
    get,
    onValue,
    push,
    ref,
    set,
} from 'firebase/database';

import { database } from './firebase';

import {
    ChatMessage,
    Conversation,
} from '../types/chat';

function createConversationId(
    firstUserId: string,
    secondUserId: string
): string {
    return [firstUserId, secondUserId]
        .sort()
        .join('_');
}

export async function getOrCreateConversation(
    firstUserId: string,
    secondUserId: string
): Promise<Conversation> {
    const conversationId = createConversationId(
        firstUserId,
        secondUserId
    );

    const conversationReference = ref(
        database,
        `conversations/${conversationId}`
    );

    const snapshot = await get(
        conversationReference
    );

    if (snapshot.exists()) {
        return snapshot.val() as Conversation;
    }

    const participants = [
        firstUserId,
        secondUserId,
    ].sort() as [string, string];

    const conversation: Conversation = {
        id: conversationId,
        participants,
        createdAt: Date.now(),
    };

    await set(
        conversationReference,
        conversation
    );

    return conversation;
}

interface SendMessageParams {
    conversationId: string;
    senderId: string;
    receiverId: string;
    text: string;
}

export async function sendChatMessage({
    conversationId,
    senderId,
    receiverId,
    text,
}: SendMessageParams): Promise<void> {
    const normalizedText = text.trim();

    if (!normalizedText) {
        throw new Error(
            'A mensagem não pode estar vazia.'
        );
    }

    const messagesReference = ref(
        database,
        `messages/${conversationId}`
    );

    const messageReference = push(
        messagesReference
    );

    const messageId = messageReference.key;

    if (!messageId) {
        throw new Error(
            'Não foi possível gerar o ID da mensagem.'
        );
    }

    const message: ChatMessage = {
        id: messageId,
        conversationId,
        senderId,
        receiverId,
        text: normalizedText,
        createdAt: Date.now(),
    };

    await set(
        messageReference,
        message
    );
}

export function listenToMessages(
    conversationId: string,
    onMessages: (
        messages: ChatMessage[]
    ) => void,
    onError?: (error: Error) => void
): () => void {
    const messagesReference = ref(
        database,
        `messages/${conversationId}`
    );

    const unsubscribe = onValue(
        messagesReference,
        (snapshot) => {
            if (!snapshot.exists()) {
                onMessages([]);
                return;
            }

            const data = snapshot.val() as Record<
                string,
                ChatMessage
            >;

            const messages = Object.values(data)
                .sort(
                    (firstMessage, secondMessage) =>
                        firstMessage.createdAt -
                        secondMessage.createdAt
                );

            onMessages(messages);
        },
        (error) => {
            if (onError) {
                onError(error);
            }
        }
    );

    return unsubscribe;
}