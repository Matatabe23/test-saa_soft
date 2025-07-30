export interface Account {
    id: number;
    labelInput: string;
    label: { text: string }[];
    type: 'local' | 'LDAP';
    login: string;
    password: string | null;
    showPassword: boolean;
    errors: {
        label: boolean;
        login: boolean;
        password: boolean;
        type: boolean;
    };
}