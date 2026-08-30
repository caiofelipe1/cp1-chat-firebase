import {
    StyleSheet,
    Text,
} from 'react-native';

interface ErrorMessageProps {
    message: string;
}

export function ErrorMessage({
    message,
}: ErrorMessageProps) {
    return (
        <Text style={styles.message}>
            {message}
        </Text>
    );
}

const styles = StyleSheet.create({
    message: {
        color: '#b00020',
        textAlign: 'center',
        marginVertical: 8,
    },
});