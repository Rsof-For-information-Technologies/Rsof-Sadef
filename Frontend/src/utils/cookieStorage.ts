import CryptoJS from "crypto-js";
import Cookies, { CookieAttributes } from "js-cookie";

export const setCookie = (name: string, value: any, options = {}) => {
  let isHTTPS = window.location.protocol === 'https:';
  const encryptedValue = CryptoJS.AES.encrypt(
    `${JSON.stringify(value)}`,
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
  ).toString();
  const defaultOptions: CookieAttributes  = {
    secure: isHTTPS,
    sameSite: isHTTPS ? "Strict" as const : "Lax" as const,
    expires: 1,
  };
  const cookieOptions = { ...defaultOptions, ...options };
  Cookies.set(name, encryptedValue, cookieOptions);
};

export const getCookie = (name:string) => {
  const encryptedValue = Cookies?.get(name);
  if (!encryptedValue) {
    return null;
  }
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Error decrypting cookie:", error);
    return null;
  }
};

export const removeCookie = (name:string) => {
  let isHTTPS = window.location.protocol === 'https:';
  Cookies.remove(name, {
    secure: isHTTPS,
    sameSite: isHTTPS ? "Strict" as const : "Lax" as const,
  });
};