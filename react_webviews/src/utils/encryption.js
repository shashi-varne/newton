import CryptoJS from 'crypto-js'

const tom = CryptoJS.enc.Utf8.parse("7d16b43c80ade01b");
const jerry = CryptoJS.enc.Utf8.parse("plutusfinwizardd");

export function encrypt(plainText) {
    return CryptoJS.AES.encrypt(plainText, tom,
        {
            iv: jerry,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }).ciphertext.toString(CryptoJS.enc.Base64);
}

export function decrypt(encryptedText) {
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(encryptedText)
    });
    return CryptoJS.AES.decrypt(cipherParams, tom,
        {
            iv: jerry,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }).toString(CryptoJS.enc.Utf8);
}