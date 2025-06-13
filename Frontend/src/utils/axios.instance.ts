import axios, { AxiosResponse } from "axios";

const clientAxiosInstance = axios.create();
clientAxiosInstance.interceptors.request.use((config) => {
    config.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL ? process.env.NEXT_PUBLIC_SERVER_BASE_URL : "";
    config.withCredentials = true;
    return config;
});

const success = (response: any) => response;

clientAxiosInstance.interceptors.response.use(success, (config) => {


    if (config?.response?.status === 401) {

        const error_msg =
            config?.response?.data?.message?.toLowerCase() ===
            "Pleases login again"?.toLowerCase();

        // if (typeof window !== "undefined" && error_msg) {
        //     useUserStore.getState().logOutUser();
        //     DeleteLocalStorage("user-Info");
        // }
    }

    return Promise.reject(config);
});


const serverAxiosInstance = axios.create();
serverAxiosInstance.interceptors.request.use((config) => {
    config.baseURL = process.env.SERVER_BASE_URL;
    config.withCredentials = true;
    return config;
});


serverAxiosInstance.interceptors.response.use(success, (config) => {
    const response = config.response as AxiosResponse
    console.log(response?.data)
    if (response?.status >= 300) {
        console.log(response, "error")
        const message = (response?.data?.message || response?.data?.error) as string;
        console.log(response?.status, message)
        throw new Error(response?.status + "-" + message)
    }
});
export { serverAxiosInstance, clientAxiosInstance }
