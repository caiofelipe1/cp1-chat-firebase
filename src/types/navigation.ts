export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Users: undefined;

    Chat: {
        participantId: string;
        participantName: string;
    };
};