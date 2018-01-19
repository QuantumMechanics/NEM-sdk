import CryptoJS from 'crypto-js';

const _hexEncodeArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

/**
* Reversed convertion of hex to Uint8Array
*
* @param {string} hexx - An hex string
*
* @return {Uint8Array}
*/
const hex2uaReversed = function (hexx) {
  const hex = hexx.toString(); // force conversion
  const ua = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    ua[ua.length - 1 - (i / 2)] = parseInt(hex.substr(i, 2), 16);
  }
  return ua;
};

/**
* Converts a raw javascript string into a string of single byte characters using utf8 encoding.
* This makes it easier to perform other encoding operations on the string.
*
* @param {string} input - A raw string
*
* @return {string} - UTF-8 string
*/
const rstr2utf8 = function (input) {
  let output = '';

  for (let n = 0; n < input.length; n++) {
    const c = input.charCodeAt(n);

    if (c < 128) {
      output += String.fromCharCode(c);
    } else if ((c > 127) && (c < 2048)) {
      output += String.fromCharCode((c >> 6) | 192);
      output += String.fromCharCode((c & 63) | 128);
    } else {
      output += String.fromCharCode((c >> 12) | 224);
      output += String.fromCharCode(((c >> 6) & 63) | 128);
      output += String.fromCharCode((c & 63) | 128);
    }
  }

  return output;
};

/**
* Convert hex to Uint8Array
*
* @param {string} hexx - An hex string
*
* @return {Uint8Array}
*/
const hex2ua = function (hexx) {
  const hex = hexx.toString(); // force conversion
  const ua = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    ua[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return ua;
};

/**
* Convert an Uint8Array to hex
*
* @param {Uint8Array} ua - An Uint8Array
*
* @return {string}
*/
const ua2hex = function (ua) {
  let s = '';
  for (let i = 0; i < ua.length; i++) {
    const code = ua[i];
    s += _hexEncodeArray[code >>> 4];
    s += _hexEncodeArray[code & 0x0F];
  }
  return s;
};

/**
* Convert hex to string
*
* @param {string} hexx - An hex string
*
* @return {string}
*/
const hex2a = function (hexx) {
  const hex = hexx.toString();
  let str = '';
  for (let i = 0; i < hex.length; i += 2) { str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); }
  return str;
};

// Padding helper for above function
const strlpad = function (str, pad, len) {
  let result = str;
  while (str.length < len) {
    result = pad + str;
  }
  return result;
};
/**
* Convert UTF-8 to hex
*
* @param {string} str - An UTF-8 string
*
* @return {string}
*/
const utf8ToHex = function (str) {
  const rawString = rstr2utf8(str);
  let hex = '';
  for (let i = 0; i < rawString.length; i++) {
    hex += strlpad(rawString.charCodeAt(i).toString(16), '0', 2);
  }
  return hex;
};


/**
* Convert an Uint8Array to WordArray
*
* @param {Uint8Array} ua - An Uint8Array
* @param {number} uaLength - The Uint8Array length
*
* @return {WordArray}
*/
const ua2words = function (ua, uaLength) {
  const temp = [];
  for (let i = 0; i < uaLength; i += 4) {
    const x = ua[i] * 0x1000000 + (ua[i + 1] || 0) * 0x10000 + (ua[i + 2] || 0) * 0x100 + (ua[i + 3] || 0);
    temp.push((x > 0x7fffffff) ? x - 0x100000000 : x);
  }
  return CryptoJS.lib.WordArray.create(temp, uaLength);
};

/**
* Convert a wordArray to Uint8Array
*
* @param {Uint8Array} destUa - A destination Uint8Array
* @param {WordArray} cryptowords - A wordArray
*
* @return {Uint8Array}
*/
const words2ua = function (destUa, cryptowords) {
  const destUaResult = destUa;
  for (let i = 0; i < destUa.length; i += 4) {
    let v = cryptowords.words[i / 4];
    if (v < 0) v += 0x100000000;
    destUaResult[i] = (v >>> 24);
    destUaResult[i + 1] = (v >>> 16) & 0xff;
    destUaResult[i + 2] = (v >>> 8) & 0xff;
    destUaResult[i + 3] = v & 0xff;
  }
  return destUaResult;
};

// Does the reverse of rstr2utf8.
const utf82rstr = function (input) {
  let output = '';
  let i = 0;
  let c = 0;
  let c2 = 0;
  let c3 = 0;

  while (i < input.length) {
    c = input.charCodeAt(i);

    if (c < 128) {
      output += String.fromCharCode(c);
      i++;
    } else if ((c > 191) && (c < 224)) {
      c2 = input.charCodeAt(i + 1);
      output += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = input.charCodeAt(i + 1);
      c3 = input.charCodeAt(i + 2);
      output += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }

  return output;
};

module.exports = {
  hex2uaReversed,
  hex2ua,
  ua2hex,
  hex2a,
  utf8ToHex,
  ua2words,
  words2ua,
  rstr2utf8,
  utf82rstr,
};
