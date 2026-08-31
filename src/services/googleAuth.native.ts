import {
    GoogleAuthProvider,
    signInWithCredential,
} from 'firebase/auth';

import {
    GoogleOneTapSignIn,
    isCancelledResponse,
    isNoSavedCredentialFoundResponse,
    isSuccessResponse,
} from 'react-native-nitro-google-signin';

import { auth } from './firebase';
import { saveUser } from './userService';

import { ChatUser } from '../types/user';

GoogleOneTapSignIn.configure({
    webClientId: 'autoDetect',
});

export async function loginWithGoogle(): Promise<ChatUser> {
    try {
        await GoogleOneTapSignIn.checkPlayServices();

        let response =
            await GoogleOneTapSignIn.signIn();

        if (
            isNoSavedCredentialFoundResponse(
                response
            )
        ) {
            response =
                await GoogleOneTapSignIn.createAccount();
        }

        if (
            isNoSavedCredentialFoundResponse(
                response
            )
        ) {
            response =
                await GoogleOneTapSignIn.presentExplicitSignIn();
        }

        if (
            isCancelledResponse(
                response
            )
        ) {
            throw new Error(
                'O login com Google foi cancelado.'
            );
        }

        if (
            !isSuccessResponse(
                response
            )
        ) {
            throw new Error(
                'Não foi possível concluir o login com Google.'
            );
        }

        const { idToken } =
            response.data;

        if (!idToken) {
            throw new Error(
                'O Google não retornou um token de autenticação.'
            );
        }

        const firebaseCredential =
            GoogleAuthProvider.credential(
                idToken
            );

        const credential =
            await signInWithCredential(
                auth,
                firebaseCredential
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
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            'Não foi possível realizar o login com Google.'
        );
    }
}