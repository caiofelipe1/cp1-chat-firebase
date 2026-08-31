import {
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';

interface AppleSignInButtonProps {
    onPress: () => void;
    disabled: boolean;
    loading: boolean;
}

export function AppleSignInButton(
    _props: AppleSignInButtonProps
) {
    return (
        <Pressable
            style={[
                styles.button,
                styles.disabled,
            ]}
            disabled
        >
            <Text style={styles.text}>
                Entrar com Apple
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 48,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    disabled: {
        opacity: 0.5,
    },

    text: {
        color: '#111111',
    },
});