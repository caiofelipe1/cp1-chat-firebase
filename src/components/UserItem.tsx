import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { ChatUser } from '../types/user';

import {
    colors,
    radius,
} from '../styles/theme';

interface UserItemProps {
    user: ChatUser;
    onPress: (user: ChatUser) => void;
}

function getInitials(
    name: string
): string {
    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) {
        return '?';
    }

    if (parts.length === 1) {
        return parts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}

function getProviderLabel(
    provider: ChatUser['provider']
): string {
    switch (provider) {
        case 'google':
            return 'Google';

        case 'apple':
            return 'Apple';

        case 'password':
            return 'E-mail';

        default:
            return provider;
    }
}

export function UserItem({
    user,
    onPress,
}: UserItemProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed &&
                    styles.containerPressed,
            ]}
            onPress={() =>
                onPress(user)
            }
        >
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {getInitials(user.name)}
                </Text>
            </View>

            <View style={styles.content}>
                <Text
                    style={styles.name}
                    numberOfLines={1}
                >
                    {user.name}
                </Text>

                <Text
                    style={styles.email}
                    numberOfLines={1}
                >
                    {user.email ??
                        'E-mail não informado'}
                </Text>

                <View
                    style={
                        styles.providerBadge
                    }
                >
                    <Text
                        style={
                            styles.providerText
                        }
                    >
                        {getProviderLabel(
                            user.provider
                        )}
                    </Text>
                </View>
            </View>

            <View style={styles.action}>
                <Text style={styles.actionText}>
                    Conversar
                </Text>

                <Text style={styles.arrow}>
                    ›
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.large,
        padding: 16,
        marginBottom: 12,
    },

    containerPressed: {
        backgroundColor:
            colors.inputBackground,
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    avatarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },

    content: {
        flex: 1,
        minWidth: 0,
    },

    name: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },

    email: {
        color: colors.textSecondary,
        fontSize: 13,
        marginTop: 3,
    },

    providerBadge: {
        alignSelf: 'flex-start',
        backgroundColor:
            colors.inputBackground,
        borderRadius: radius.full,
        paddingHorizontal: 9,
        paddingVertical: 4,
        marginTop: 7,
    },

    providerText: {
        color: colors.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },

    action: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
        gap: 4,
    },

    actionText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '700',
    },

    arrow: {
        color: colors.primary,
        fontSize: 23,
        lineHeight: 23,
    },
});