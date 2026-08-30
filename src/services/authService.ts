import { FirebaseError } from 'firebase/app';

import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
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
    const credential =
        await createUserWithEmailAndPassword(
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

export async function logout(): Promise<void> {
    await signOut(auth);
}

export function getAuthErrorMessage(
    error: unknown
): string {
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

        case 'auth/popup-closed-by-user':
            return 'O login com Google foi cancelado.';

        case 'auth/popup-blocked':
            return 'O navegador bloqueou a janela de login do Google.';

        case 'auth/account-exists-with-different-credential':
            return 'Já existe uma conta com este e-mail utilizando outra forma de login.';

        default:
            return 'Não foi possível realizar a operação.';
    }
}