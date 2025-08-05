export const convertNumberToLocalFormat = (phoneNumber: string) => {
  if (!phoneNumber) return '';

  const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');

  if (cleanNumber.startsWith('+966') && cleanNumber.length >= 12) {
    return '0' + cleanNumber.substring(4);
  }

  return phoneNumber;
};