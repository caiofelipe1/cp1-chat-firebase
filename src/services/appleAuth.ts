import { ChatUser } from '../types/user';

export async function loginWithApple(): Promise<ChatUser> {
    throw new Error(
        'O login com Apple está disponível apenas no iOS.'
    );
}