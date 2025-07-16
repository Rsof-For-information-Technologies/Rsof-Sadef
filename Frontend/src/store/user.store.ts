import { User } from '@/types/user';
import { removeCookie } from '@/utils/cookieStorage';
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/utils/localStorage';
import { create } from 'zustand';

type T_UserStore = {
    userInfo: User | undefined;
    setUserInfo: (UserInfo?: User) => void;
    logOutUser: (request?: boolean) => void;
}

export const useUserStore = create<T_UserStore>((set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => {
    if (userInfo) {
      setLocalStorage("user-info", userInfo);
    }
    set({ userInfo });
  },
  getUserInfo: () => {
    const storedUser = getLocalStorage<User>("user-info");
    if (storedUser) {
      if (typeof storedUser === "string") {
        try {
          set({ userInfo: JSON.parse(storedUser) });
        } catch (error) {
          console.error("Error parsing user info:", error);
          set({ userInfo: storedUser });
        }
      } else {
        set({ userInfo: storedUser });
      }
    }
  },
  logOutUser: async () => {
    try {
      //   await axiosInstance.post("/user/logout");
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      removeLocalStorage("user-info");
      removeCookie("access_token");
      removeCookie("refresh_token");
      set({ userInfo: undefined });
    }
  },
}));
