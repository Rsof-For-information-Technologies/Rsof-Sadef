import CryptoJS from "crypto-js";

export const setLocalStorage = (name: string, value: any) => {
  value = CryptoJS.AES.encrypt(
    `${JSON.stringify(value)}`,
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
  ).toString();
  localStorage.setItem(name, JSON.stringify(value));
};

export const getLocalStorage = <T>(name: string): T | null => {
  console.log(`getLocalStorage: ${name}`);
  const local = localStorage?.getItem(name);
  console.log("local",local)
  if (!local) return null;

  try {
    const encrypted = JSON.parse(local);
    console.log("encrypted", encrypted)
    const decrypted = CryptoJS.AES.decrypt(
      encrypted,
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
    );
    console.log("decrypted", decrypted)
    const parsed = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    console.log("parsed", parsed)
    return parsed as T;
  } catch (error) {
    console.error("getLocalStorage error:", error);
    return null;
  }
};


export const removeLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};

