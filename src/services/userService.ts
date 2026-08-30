import { get, ref, set } from 'firebase/database';

import { database } from './firebase';
import { ChatUser } from '../types/user';

export async function saveUser(
    user: ChatUser
): Promise<void> {
    const userReference = ref(
        database,
        `users/${user.uid}`
    );

    await set(userReference, user);
}

export async function getUserById(
    uid: string
): Promise<ChatUser | null> {
    const userReference = ref(
        database,
        `users/${uid}`
    );

    const snapshot = await get(userReference);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val() as ChatUser;
}

export async function getAllUsers(): Promise<ChatUser[]> {
    const usersReference = ref(database, 'users');

    const snapshot = await get(usersReference);

    if (!snapshot.exists()) {
        return [];
    }

    const users = snapshot.val() as Record<
        string,
        ChatUser
    >;

    return Object.values(users);
}