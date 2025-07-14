export type LoginItem = {
    token: string;
    id: string;
    firstName: string;
    lasttName: string;
    email: string;
    role: string;
    refreshToken: string
}

type LoginData = {
    items: LoginItem[];
};

export type login = {
    succeeded: boolean,
    message: string | null,
    validationResultModel: string | null,
    data: LoginData,
}