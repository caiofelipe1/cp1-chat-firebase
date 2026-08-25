import { getApp, getApps, initializeApp } from 'firebase/app';
import {
    Auth,
    getAuth,
    getReactNativePersistence,
    initializeAuth,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyC956KCWDuFjW7CdzhruFmKiG_iQ-2raZo",
    authDomain: "cp1-chat-firebase.firebaseapp.com",
    projectId: "cp1-chat-firebase",
    storageBucket: "cp1-chat-firebase.firebasestorage.app",
    messagingSenderId: "1044938278959",
    appId: "1:1044938278959:web:211c215d02ee5d53d71eda",
    measurementId: "G-R760V5JDDR",
    databaseURL: "https://cp1-chat-firebase-default-rtdb.firebaseio.com/"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let authInstance: Auth;

try {
    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
} catch {
    authInstance = getAuth(app);
}

export const auth = authInstance;
export const database = getDatabase(app);

export default app;

