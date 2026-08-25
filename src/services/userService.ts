import { get, ref, set } from 'firebase/database';

import { database } from './firebase';
import { ChatUser } from '../types/user';

export async function saveUser(user: ChatUser): Promise<void> {
    const userReference = ref(database, `users/${user.uid}`);

    await set(userReference, user);
}

export async function getUserById(
    uid: string
): Promise<ChatUser | null> {
    const userReference = ref(database, `users/${uid}`);

    const snapshot = await get(userReference);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val() as ChatUser;
}