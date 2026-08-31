import {
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

import { auth } from './firebase';
import { saveUser } from './userService';

import { ChatUser } from '../types/user';

export async function loginWithGoogle(): Promise<ChatUser> {
    const provider =
        new GoogleAuthProvider();

    provider.setCustomParameters({
        prompt: 'select_account',
    });

    const credential =
        await signInWithPopup(
            auth,
            provider
        );

    const firebaseUser =
        credential.user;

    const fallbackName =
        firebaseUser.email
            ?.split('@')[0] ??
        'Usuário Google';

    const user: ChatUser = {
        uid: firebaseUser.uid,
        name:
            firebaseUser.displayName?.trim() ||
            fallbackName,
        email: firebaseUser.email,
        provider: 'google',
    };

    await saveUser(user);

    return user;
}