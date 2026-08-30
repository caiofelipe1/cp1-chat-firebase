import { AuthProvider, ChatUser } from '../types/user';

export function areProvidersCompatible(
    firstProvider: AuthProvider,
    secondProvider: AuthProvider
): boolean {
    const firstIsPassword = firstProvider === 'password';
    const secondIsPassword = secondProvider === 'password';

    return firstIsPassword !== secondIsPassword;
}

export function canUsersChat(
    currentUser: ChatUser,
    targetUser: ChatUser
): boolean {
    if (currentUser.uid === targetUser.uid) {
        return false;
    }

    return areProvidersCompatible(
        currentUser.provider,
        targetUser.provider
    );
}