import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from './src/contexts/AuthContext';
import { useAuth } from './src/hooks/useAuth';

import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { UsersScreen } from './src/screens/UsersScreen';

import { Loading } from './src/components/Loading';

import { RootStackParamList } from './src/types/navigation';

const Stack =
  createNativeStackNavigator<RootStackParamList>();

function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Users"
            component={UsersScreen}
            options={{
              title: 'Contatos',
              headerBackVisible: false,
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Cadastro',
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
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}