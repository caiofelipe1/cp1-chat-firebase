import {
    NavigationContainer,
} from '@react-navigation/native';

import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
    SafeAreaProvider,
} from 'react-native-safe-area-context';

import {
    StatusBar,
} from 'expo-status-bar';

import {
    AuthProvider,
} from './src/contexts/AuthContext';

import {
    useAuth,
} from './src/hooks/useAuth';

import {
    LoginScreen,
} from './src/screens/LoginScreen';

import {
    RegisterScreen,
} from './src/screens/RegisterScreen';

import {
    UsersScreen,
} from './src/screens/UsersScreen';

import {
    ChatScreen,
} from './src/screens/ChatScreen';

import {
    Loading,
} from './src/components/Loading';

import {
    RootStackParamList,
} from './src/types/navigation';

import {
    colors,
} from './src/styles/theme';

const Stack =
    createNativeStackNavigator<
        RootStackParamList
    >();

function Routes() {
    const {
        user,
        loading,
    } = useAuth();

    if (loading) {
        return <Loading />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen
                            name="Users"
                            component={
                                UsersScreen
                            }
                            options={{
                                headerShown:
                                    false,
                            }}
                        />

                        <Stack.Screen
                            name="Chat"
                            component={
                                ChatScreen
                            }
                            options={{
                                headerShown:
                                    false,
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={
                                LoginScreen
                            }
                            options={{
                                headerShown:
                                    false,
                            }}
                        />

                        <Stack.Screen
                            name="Register"
                            component={
                                RegisterScreen
                            }
                            options={{
                                title:
                                    'Cadastro',

                                headerShadowVisible:
                                    false,

                                headerStyle: {
                                    backgroundColor:
                                        colors.surface,
                                },

                                headerTintColor:
                                    colors.text,
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar
                style="dark"
                backgroundColor={
                    colors.background
                }
            />

            <AuthProvider>
                <Routes />
            </AuthProvider>
        </SafeAreaProvider>
    );
}