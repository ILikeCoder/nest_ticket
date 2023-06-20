import * as CryptoJS from 'crypto-js';
// 手机号加密 存储到数据库 作为唯一标识
export function encryptString(phone) {
  const hash = CryptoJS.MD5(phone + 'adsfl');
  const encryptedData = hash.toString();
  return encryptedData.substring(0, 13);
}
