import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { ChatUser } from '../types/user';

interface UserItemProps {
    user: ChatUser;
    onPress: (user: ChatUser) => void;
}

export function UserItem({
    user,
    onPress,
}: UserItemProps) {
    return (
        <Pressable
            style={styles.container}
            onPress={() => onPress(user)}
        >
            <View>
                <Text style={styles.name}>
                    {user.name}
                </Text>

                <Text style={styles.email}>
                    {user.email ?? 'E-mail não informado'}
                </Text>

                <Text style={styles.provider}>
                    Login: {user.provider}
                </Text>
            </View>

            <Text style={styles.action}>
                Conversar
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    name: {
        fontSize: 17,
        fontWeight: 'bold',
    },

    email: {
        marginTop: 4,
        color: '#555555',
    },

    provider: {
        marginTop: 4,
        fontSize: 12,
        color: '#777777',
    },

    action: {
        fontWeight: 'bold',
    },
});