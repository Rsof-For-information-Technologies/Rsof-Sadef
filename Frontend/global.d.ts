export { }
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_SERVER_BASE_URL: string;
            SERVER_BASE_URL: string;
            NEXT_PUBLIC_ENCRYPTION_KEY: string;
            APP_BASE_URL: string;
            NEXT_PUBLIC_APP_BASE_URL: string;
        }
    }

}
