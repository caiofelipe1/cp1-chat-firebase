import { FirebaseError } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';

import { auth } from './firebase';
import { saveUser } from './userService';
import { ChatUser } from '../types/user';

export async function registerWithEmailAndPassword(
    name: string,
    email: string,
    password: string
): Promise<ChatUser> {
    const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
    );

    await updateProfile(credential.user, {
        displayName: name.trim(),
    });

    const user: ChatUser = {
        uid: credential.user.uid,
        name: name.trim(),
        email: credential.user.email,
        provider: 'password',
    };

    await saveUser(user);

    return user;
}

export async function loginWithEmailAndPassword(
    email: string,
    password: string
): Promise<void> {
    await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
    );
}

export async function logout(): Promise<void> {
    await signOut(auth);
}

export function getAuthErrorMessage(error: unknown): string {
    if (!(error instanceof FirebaseError)) {
        return 'Ocorreu um erro inesperado.';
    }

    switch (error.code) {
        case 'auth/invalid-email':
            return 'O e-mail informado é inválido.';

        case 'auth/email-already-in-use':
            return 'Já existe uma conta cadastrada com este e-mail.';

        case 'auth/weak-password':
            return 'A senha informada é muito fraca.';

        case 'auth/invalid-credential':
            return 'E-mail ou senha incorretos.';

        case 'auth/user-not-found':
            return 'Usuário não encontrado.';

        case 'auth/wrong-password':
            return 'E-mail ou senha incorretos.';

        case 'auth/network-request-failed':
            return 'Não foi possível conectar ao servidor. Verifique sua internet.';

        default:
            return 'Não foi possível realizar a operação.';
    }
}