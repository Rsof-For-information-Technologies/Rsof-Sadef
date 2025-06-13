import { User } from '@/types/user';
import { clientAxiosInstance } from '@/utils/axios.instance';
import { DeleteLocalStorage } from '@/utils/localStorage';
import { create } from 'zustand'

type T_UserStore = {
    userInfo: User | undefined;
    setUserInfo: (UserInfo?: User) => void;
    logOutUser: (request?: boolean) => void;
}

export const useUserStore = create<T_UserStore>((set, get) => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => set((store) => ({ ...store, userInfo })),
    logOutUser: async (request) => {
        if (request) {
            console.log({ request })
            try {
                const { data } = await clientAxiosInstance.post("/api/logout");
                DeleteLocalStorage("user-info")
                set((store) => ({ ...store, userInfo: undefined }))

            } catch (error) {
                console.log(error)
            }
        }

    },
}))