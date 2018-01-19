import CryptoJS from 'crypto-js';
import KeyPair from './keyPair';
import convert from '../utils/convert';
import Address from '../model/address';
import nacl from '../external/nacl-fast';
import Helpers from '../utils/helpers';

/**
 * Encrypt a private key for mobile apps (AES_PBKF2)
 *
 * @param {string} password - A wallet password
 * @param {string} privateKey - An account private key
 *
 * @return {object} - The encrypted data
 */
const toMobileKey = function (password, privateKey) {
  // Errors
  if (!password || !privateKey) throw new Error('Missing argument !');
  if (!Helpers.isPrivateKeyValid(privateKey)) throw new Error('Private key is not valid !');
  // Processing
  const salt = CryptoJS.lib.WordArray.random(256 / 8);
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 2000,
  });
  const iv = nacl.randomBytes(16);
  const encIv = {
    iv: convert.ua2words(iv, 16),
  };
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(privateKey), key, encIv);
  // Result
  return {
    encrypted: convert.ua2hex(iv) + encrypted.ciphertext,
    salt: salt.toString(),
  };
};

/**
 * Derive a private key from a password using count iterations of SHA3-256
 *
 * @param {string} password - A wallet password
 * @param {number} count - A number of iterations above 0
 *
 * @return {object} - The derived private key
 */
const derivePassSha = function (password, count) {
  // Errors
  if (!password) throw new Error('Missing argument !');
  if (!count || count <= 0) throw new Error('Please provide a count number above 0');
  // Processing
  let data = password;
  console.time('sha3^n generation time');
  for (let i = 0; i < count; ++i) {
    data = CryptoJS.SHA3(data, {
      outputLength: 256,
    });
  }
  console.timeEnd('sha3^n generation time');
  // Result
  return {
    priv: CryptoJS.enc.Hex.stringify(data),
  };
};

/**
 * Decrypt data
 *
 * @param {object} data - An encrypted data object
 *
 * @return {string} - The decrypted hex string
 */
const decrypt = function (data) {
  // Errors
  if (!data) throw new Error('Missing argument !');
  // Processing
  const encKey = convert.ua2words(data.key, 32);
  const encIv = {
    iv: convert.ua2words(data.iv, 16),
  };
    // Result
  return CryptoJS.enc.Hex.stringify(CryptoJS.AES.decrypt(data, encKey, encIv));
};

/**
 * Reveal the private key of an account or derive it from the wallet password
 *
 * @param {object} commonParam - An object containing password and privateKey field
 * @param {object} walletAccount - A wallet account object
 * @param {string} algo - A wallet algorithm
 *
 * @return {object|boolean} - The account private key in and object or false
 */
const passwordToPrivatekey = function (commonParam, walletAccount, algo) {
  const common = commonParam;
  // Errors
  if (!common || !walletAccount || !algo) throw new Error('Missing argument !');

  let r;

  if (algo === 'trezor') { // HW wallet
    r = { priv: '' };
    common.isHW = true;
  } else if (!common.password) {
    throw new Error('Missing argument !');
  }

  // Processing
  if (algo === 'pass:6k') { // Brain wallets
    if (!walletAccount.encrypted && !walletAccount.iv) {
      // Account private key is generated simply using a passphrase so it has no encrypted and iv
      r = derivePassSha(common.password, 6000);
    } else if (!walletAccount.encrypted || !walletAccount.iv) {
      // Else if one is missing there is a problem
      // console.log("Account might be compromised, missing encrypted or iv");
      return false;
    } else {
      // Else child accounts have encrypted and iv so we decrypt
      const pass = derivePassSha(common.password, 20);
      const obj = {
        ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
        iv: convert.hex2ua(walletAccount.iv),
        key: convert.hex2ua(pass.priv),
      };
      const d = decrypt(obj);
      r = { priv: d };
    }
  } else if (algo === 'pass:bip32') { // Wallets from PRNG
    const pass = derivePassSha(common.password, 20);
    const obj = {
      ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
      iv: convert.hex2ua(walletAccount.iv),
      key: convert.hex2ua(pass.priv),
    };
    const d = decrypt(obj);
    r = { priv: d };
  } else if (algo === 'pass:enc') { // Private Key wallets
    const pass = derivePassSha(common.password, 20);
    const obj = {
      ciphertext: CryptoJS.enc.Hex.parse(walletAccount.encrypted),
      iv: convert.hex2ua(walletAccount.iv),
      key: convert.hex2ua(pass.priv),
    };
    const d = decrypt(obj);
    r = { priv: d };
  } else if (!r) {
    // console.log("Unknown wallet encryption method");
    return false;
  }
  // Result
  common.privateKey = r.priv;
  return true;
};

/**
 * Check if a private key correspond to an account address
 *
 * @param {string} priv - An account private key
 * @param {number} network - A network id
 * @param {string} _expectedAddress - The expected NEM address
 *
 * @return {boolean} - True if valid, false otherwise
 */
const checkAddress = function (priv, network, _expectedAddress) {
  // Errors
  if (!priv || !network || !_expectedAddress) throw new Error('Missing argument !');
  if (!Helpers.isPrivateKeyValid(priv)) throw new Error('Private key is not valid !');
  // Processing
  const expectedAddress = _expectedAddress.toUpperCase().replace(/-/g, '');
  const kp = KeyPair.create(priv);
  const address = Address.toAddress(kp.publicKey.toString(), network);
  // Result
  return address === expectedAddress;
};

function hashfunc(dest, data, dataLength) {
  const convertedData = convert.ua2words(data, dataLength);
  const hash = CryptoJS.SHA3(convertedData, {
    outputLength: 512,
  });
  convert.words2ua(dest, hash);
}

function keyDerive(sharedParam, salt, sk, pk) {
  const shared = sharedParam;
  nacl.lowlevel.crypto_shared_key_hash(shared, pk, sk, hashfunc);
  for (let i = 0; i < salt.length; i++) {
    shared[i] ^= salt[i];
  }
  const hash = CryptoJS.SHA3(convert.ua2words(shared, 32), {
    outputLength: 256,
  });
  return hash;
}

/**
 * Generate a random key
 *
 * @return {Uint8Array} - A random key
 */
const randomKey = function () {
  const rkey = nacl.randomBytes(32);
  return rkey;
};

/**
 * Encrypt hex data using a key
 *
 * @param {string} data - An hex string
 * @param {Uint8Array} key - An Uint8Array key
 *
 * @return {object} - The encrypted data
 */
const encrypt = function (data, key) {
  // Errors
  if (!data || !key) throw new Error('Missing argument !');
  // Processing
  const iv = nacl.randomBytes(16);
  const encKey = convert.ua2words(key, 32);
  const encIv = {
    iv: convert.ua2words(iv, 16),
  };
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(data), encKey, encIv);
  // Result
  return {
    ciphertext: encrypted.ciphertext,
    iv,
    key,
  };
};

/**
 * Encode a private key using a password
 *
 * @param {string} privateKey - An hex private key
 * @param {string} password - A password
 *
 * @return {object} - The encoded data
 */
const encodePrivKey = function (privateKey, password) {
  // Errors
  if (!privateKey || !password) throw new Error('Missing argument !');
  if (!Helpers.isPrivateKeyValid(privateKey)) throw new Error('Private key is not valid !');
  // Processing
  const pass = derivePassSha(password, 20);
  const r = encrypt(privateKey, convert.hex2ua(pass.priv));
  // Result
  return {
    ciphertext: CryptoJS.enc.Hex.stringify(r.ciphertext),
    iv: convert.ua2hex(r.iv),
  };
};

/** *
 * Encode a message, separated from encode() to help testing
 *
 * @param {string} senderPriv - A sender private key
 * @param {string} recipientPub - A recipient public key
 * @param {string} msg - A text message
 * @param {Uint8Array} iv - An initialization vector
 * @param {Uint8Array} salt - A salt
 *
 * @return {string} - The encoded message
 */
const _encode = function (senderPriv, recipientPub, msg, iv, salt) {
  // Errors
  if (!senderPriv || !recipientPub || !msg || !iv || !salt) throw new Error('Missing argument !');
  if (!Helpers.isPrivateKeyValid(senderPriv)) throw new Error('Private key is not valid !');
  if (!Helpers.isPublicKeyValid(recipientPub)) throw new Error('Public key is not valid !');
  // Processing
  const sk = convert.hex2uaReversed(senderPriv);
  const pk = convert.hex2ua(recipientPub);
  const shared = new Uint8Array(32);
  const r = keyDerive(shared, salt, sk, pk);
  const encKey = r;
  const encIv = {
    iv: convert.ua2words(iv, 16),
  };
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(convert.utf8ToHex(msg)), encKey, encIv);
  // Result
  const result = convert.ua2hex(salt) + convert.ua2hex(iv) + CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
  return result;
};

/**
 * Encode a message
 *
 * @param {string} senderPriv - A sender private key
 * @param {string} recipientPub - A recipient public key
 * @param {string} msg - A text message
 *
 * @return {string} - The encoded message
 */
const encode = function (senderPriv, recipientPub, msg) {
  // Errors
  if (!senderPriv || !recipientPub || !msg) throw new Error('Missing argument !');
  if (!Helpers.isPrivateKeyValid(senderPriv)) throw new Error('Private key is not valid !');
  if (!Helpers.isPublicKeyValid(recipientPub)) throw new Error('Public key is not valid !');
  // Processing
  const iv = nacl.randomBytes(16);
  // console.log("IV:", convert.ua2hex(iv));
  const salt = nacl.randomBytes(32);
  const encoded = _encode(senderPriv, recipientPub, msg, iv, salt);
  // Result
  return encoded;
};

/**
 * Decode an encrypted message payload
 *
 * @param {string} recipientPrivate - A recipient private key
 * @param {string} senderPublic - A sender public key
 * @param {string} _payload - An encrypted message payload
 *
 * @return {string} - The decoded payload as hex
 */
const decode = function (recipientPrivate, senderPublic, _payload) {
  // Errors
  if (!recipientPrivate || !senderPublic || !_payload) throw new Error('Missing argument !');
  if (!Helpers.isPrivateKeyValid(recipientPrivate)) throw new Error('Private key is not valid !');
  if (!Helpers.isPublicKeyValid(senderPublic)) throw new Error('Public key is not valid !');
  // Processing
  const binPayload = convert.hex2ua(_payload);
  const salt = new Uint8Array(binPayload.buffer, 0, 32);
  const iv = new Uint8Array(binPayload.buffer, 32, 16);
  const payload = new Uint8Array(binPayload.buffer, 48);
  const sk = convert.hex2uaReversed(recipientPrivate);
  const pk = convert.hex2ua(senderPublic);
  const shared = new Uint8Array(32);
  const r = keyDerive(shared, salt, sk, pk);
  const encKey = r;
  const encIv = {
    iv: convert.ua2words(iv, 16),
  };
  const encrypted = {
    ciphertext: convert.ua2words(payload, payload.length),
  };
  const plain = CryptoJS.AES.decrypt(encrypted, encKey, encIv);
  // Result
  const hexplain = CryptoJS.enc.Hex.stringify(plain);
  return hexplain;
};

module.exports = {
  toMobileKey,
  derivePassSha,
  passwordToPrivatekey,
  checkAddress,
  randomKey,
  decrypt,
  encrypt,
  encodePrivKey,
  _encode,
  encode,
  decode,
};
