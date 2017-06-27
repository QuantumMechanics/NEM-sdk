import convert from '../utils/convert';
import Network from './network';
import CryptoJS from 'crypto-js';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
* Encode a string to base32
*
* @param {string} s - A string
*
* @return {string} - The encoded string
*/
let b32encode = function(s) {
    let parts = [];
    let quanta = Math.floor((s.length / 5));
    let leftover = s.length % 5;

    if (leftover != 0) {
        for (let i = 0; i < (5 - leftover); i++) {
            s += '\x00';
        }
        quanta += 1;
    }

    for (let i = 0; i < quanta; i++) {
        parts.push(alphabet.charAt(s.charCodeAt(i * 5) >> 3));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5) & 0x07) << 2) | (s.charCodeAt(i * 5 + 1) >> 6)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 1) & 0x3F) >> 1)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 1) & 0x01) << 4) | (s.charCodeAt(i * 5 + 2) >> 4)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 2) & 0x0F) << 1) | (s.charCodeAt(i * 5 + 3) >> 7)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 3) & 0x7F) >> 2)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 3) & 0x03) << 3) | (s.charCodeAt(i * 5 + 4) >> 5)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 4) & 0x1F))));
    }

    let replace = 0;
    if (leftover == 1) replace = 6;
    else if (leftover == 2) replace = 4;
    else if (leftover == 3) replace = 3;
    else if (leftover == 4) replace = 1;

    for (let i = 0; i < replace; i++) parts.pop();
    for (let i = 0; i < replace; i++) parts.push("=");

    return parts.join("");
}

/**
* Decode a base32 string.
* This is made specifically for our use, deals only with proper strings
*
* @param {string} s - A base32 string
*
* @return {Uint8Array} - The decoded string
*/
let b32decode = function(s) {
    let r = new ArrayBuffer(s.length * 5 / 8);
    let b = new Uint8Array(r);
    for (let j = 0; j < s.length / 8; j++) {
        let v = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 8; ++i) {
            v[i] = alphabet.indexOf(s[j * 8 + i]);
        }
        let i = 0;
        b[j * 5 + 0] = (v[i + 0] << 3) | (v[i + 1] >> 2);
        b[j * 5 + 1] = ((v[i + 1] & 0x3) << 6) | (v[i + 2] << 1) | (v[i + 3] >> 4);
        b[j * 5 + 2] = ((v[i + 3] & 0xf) << 4) | (v[i + 4] >> 1);
        b[j * 5 + 3] = ((v[i + 4] & 0x1) << 7) | (v[i + 5] << 2) | (v[i + 6] >> 3);
        b[j * 5 + 4] = ((v[i + 6] & 0x7) << 5) | (v[i + 7]);
    }
    return b;
}

/**
* Convert a public key to a NEM address
*
* @param {string} publicKey - A public key
* @param {number} networkId - A network id
*
* @return {string} - The NEM address
*/
let toAddress = function(publicKey, networkId) {
    let binPubKey = CryptoJS.enc.Hex.parse(publicKey);
    let hash = CryptoJS.SHA3(binPubKey, {
        outputLength: 256
    });
    let hash2 = CryptoJS.RIPEMD160(hash);
    // 98 is for testnet
    let networkPrefix = Network.id2Prefix(networkId);
    let versionPrefixedRipemd160Hash = networkPrefix + CryptoJS.enc.Hex.stringify(hash2);
    let tempHash = CryptoJS.SHA3(CryptoJS.enc.Hex.parse(versionPrefixedRipemd160Hash), {
        outputLength: 256
    });
    let stepThreeChecksum = CryptoJS.enc.Hex.stringify(tempHash).substr(0, 8);
    let concatStepThreeAndStepSix = convert.hex2a(versionPrefixedRipemd160Hash + stepThreeChecksum);
    let ret = b32encode(concatStepThreeAndStepSix);
    return ret;
};

/**
* Check if an address is from a specified network
*
* @param {string} _address - An address
* @param {number} networkId - A network id
*
* @return {boolean} - True if address is from network, false otherwise
*/
let isFromNetwork = function(_address, networkId) {
    let address = _address.toString().toUpperCase().replace(/-/g, '');
    let a = address[0];
    return Network.id2Char(networkId) === a;
};

/**
* Check if an address is valid
*
* @param {string} _address - An address
*
* @return {boolean} - True if address is valid, false otherwise
*/
let isValid = function(_address) {
    let address = _address.toString().toUpperCase().replace(/-/g, '');
    if (!address || address.length !== 40) {
        return false;
    }
    let decoded = convert.ua2hex(b32decode(address));
    let versionPrefixedRipemd160Hash = CryptoJS.enc.Hex.parse(decoded.slice(0, 42));
    let tempHash = CryptoJS.SHA3(versionPrefixedRipemd160Hash, {
        outputLength: 256
    });
    let stepThreeChecksum = CryptoJS.enc.Hex.stringify(tempHash).substr(0, 8);

    return stepThreeChecksum === decoded.slice(42);
};

/**
* Remove hyphens from an address
*
* @param {string} _address - An address
*
* @return {string} - A clean address
*/
let clean = function(_address) {
    return _address.toUpperCase().replace(/-|\s/g,"");
};

module.exports = {
    b32encode,
    b32decode,
    toAddress,
    isFromNetwork,
    isValid,
    clean
}