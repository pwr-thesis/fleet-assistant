export interface UserInfo {
    name: string;
    surname: string;
    email: string;
    role: string;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    surname: string;
    email: string;
    password: string;
    number?: string;
}

export interface AuthResponse {
    token: TokenDTO;
    user: UserInfo;
}

export interface TokenDTO {
    accessToken: string;
    refreshToken: string;
}
