import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

import {
    OAuthProvider,
    signInWithCredential,
} from 'firebase/auth';

import { auth } from './firebase';

import {
    getUserById,
    saveUser,
} from './userService';

import { ChatUser } from '../types/user';

function isAppleCancellation(
    error: unknown
): boolean {
    if (
        typeof error !== 'object' ||
        error === null ||
        !('code' in error)
    ) {
        return false;
    }

    const errorWithCode =
        error as {
            code?: unknown;
        };

    return (
        errorWithCode.code ===
        'ERR_REQUEST_CANCELED'
    );
}

export async function loginWithApple(): Promise<ChatUser> {
    try {
        const rawNonce =
            Crypto.randomUUID();

        const hashedNonce =
            await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                rawNonce
            );

        const appleCredential =
            await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication
                        .AppleAuthenticationScope
                        .FULL_NAME,

                    AppleAuthentication
                        .AppleAuthenticationScope
                        .EMAIL,
                ],
                nonce: hashedNonce,
            });

        const identityToken =
            appleCredential.identityToken;

        if (!identityToken) {
            throw new Error(
                'A Apple não retornou um token de autenticação.'
            );
        }

        const provider =
            new OAuthProvider(
                'apple.com'
            );

        const firebaseCredential =
            provider.credential({
                idToken:
                    identityToken,
                rawNonce,
            });

        const credential =
            await signInWithCredential(
                auth,
                firebaseCredential
            );

        const firebaseUser =
            credential.user;

        const existingUser =
            await getUserById(
                firebaseUser.uid
            );

        const formattedAppleName =
            appleCredential.fullName
                ? AppleAuthentication
                    .formatFullName(
                        appleCredential.fullName
                    )
                    .trim()
                : '';

        const email =
            firebaseUser.email ??
            appleCredential.email ??
            existingUser?.email ??
            null;

        const emailFallbackName =
            email
                ?.split('@')[0]
                .trim() ??
            '';

        const name =
            formattedAppleName ||
            existingUser?.name ||
            firebaseUser.displayName
                ?.trim() ||
            emailFallbackName ||
            'Usuário Apple';

        const user: ChatUser = {
            uid: firebaseUser.uid,
            name,
            email,
            provider: 'apple',
        };

        await saveUser(user);

        return user;
    } catch (error) {
        if (
            isAppleCancellation(
                error
            )
        ) {
            throw new Error(
                'O login com Apple foi cancelado.'
            );
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            'Não foi possível realizar o login com Apple.'
        );
    }
}