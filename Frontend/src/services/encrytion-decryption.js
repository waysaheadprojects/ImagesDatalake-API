import CryptoJS from "crypto-js";

const secretKey='secreatKeusnkdns';
console.log(process.env.REACT_APP_SECRET_KEY);
export const encrypt = (plainText) => {
  const ciphertext = CryptoJS.AES.encrypt(plainText, secretKey).toString();
  return ciphertext;
};

export const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
