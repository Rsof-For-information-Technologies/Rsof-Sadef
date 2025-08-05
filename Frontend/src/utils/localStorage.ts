import CryptoJS from "crypto-js";

export const setLocalStorage = (name: string, value: any) => {
  value = CryptoJS.AES.encrypt(
    `${JSON.stringify(value)}`,
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
  ).toString();
  localStorage.setItem(name, JSON.stringify(value));
};

export const getLocalStorage = <T>(name: string): T | null => {
  const local = localStorage?.getItem(name);
  if (!local) return null;

  try {
    const encrypted = JSON.parse(local);
    const decrypted = CryptoJS.AES.decrypt(
      encrypted,
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
    );
    const parsed = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    return parsed as T;
  } catch (error) {
    return null;
  }
};


export const removeLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};

