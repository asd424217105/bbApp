const CryptoJS = require('./aes');
function getAesString(data, key, iv) {//加密
  var key = CryptoJS.enc.Latin1.parse(key);
  var iv = CryptoJS.enc.Latin1.parse(iv);
  var srcs = CryptoJS.enc.Utf8.parse(data);

  var encrypted = CryptoJS.AES.encrypt(srcs, key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return encrypted;
}
function getDAesString(encrypted, key, iv) {//解密
  var key = CryptoJS.enc.Latin1.parse(key);
  var iv = CryptoJS.enc.Latin1.parse(iv);
  var decrypted = CryptoJS.AES.decrypt(encrypted, key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
function getAES(data) { //加密
  //var data = "this is a test";//明文
  var key = 'www.bbgj1688.com';  //密钥
  var iv = 'ac67529a2ea18cf8';
  var encrypted = getAesString(data, key, iv); //密文
  var enstr = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);//encrypted.toString();
  //document.getElementById("encrypted").innerHTML = encrypted;
  return encrypted.toString();


}

function getDAes(data){//解密
    var key  = 'www.bbgj1688.com';
    var iv   = 'ac67529a2ea18cf8';
    var decryptedStr = getDAesString(data,key,iv);
    decryptedStr.toString(CryptoJS.enc.Utf8);
};

// module.exports.getAES = getAES


module.exports = {//很关键
  getAES: getAES,
  getDAes: getDAes
}
