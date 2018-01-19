import Format from './format';


/**
 * Test if a string is hexadecimal
 *
 * @param {string} str - A string to test
 *
 * @return {boolean} - True if correct, false otherwise
 */
const isHexadecimal = function (str) {
  return str.match('^(0x|0X)?[a-fA-F0-9]+$') !== null;
};


/**
 * Check if a multisig transaction needs signature
 *
 * @param {object} multisigTransaction - A multisig transaction
 * @param {object} data - An account data
 *
 * @return {boolean} - True if it needs signature, false otherwise
 */
const needsSignature = function (multisigTransaction, data) {
  if (multisigTransaction.transaction.signer === data.account.publicKey) {
    return false;
  }
  if (multisigTransaction.transaction.otherTrans.signer === data.account.publicKey) {
    return false;
  }
  // Check if we're already on list of signatures
  for (let i = 0; i < multisigTransaction.transaction.signatures.length; i++) {
    if (multisigTransaction.transaction.signatures[i].signer === data.account.publicKey) {
      return false;
    }
  }

  if (!data.meta.cosignatoryOf.length) {
    return false;
  }
  for (let k = 0; k < data.meta.cosignatoryOf.length; k++) {
    if (data.meta.cosignatoryOf[k].publicKey === multisigTransaction.transaction.otherTrans.signer) {
      return true;
    } else if (k === data.meta.cosignatoryOf.length - 1) {
      return false;
    }
  }

  return true;
};

/**
 * Check if a transaction is already present in an array of transactions
 *
 * @param {string} hash - A transaction hash
 * @param {array} array - An array of transactions
 *
 * @return {boolean} - True if present, false otherwise
 */
const haveTx = function (hash, array) {
  let i = null;
  for (i = 0; array.length > i; i++) {
    if (array[i].meta.hash.data === hash) {
      return true;
    }
  }
  return false;
};

/**
 * Gets the index of a transaction in an array of transactions.
 * It must be present in the array.
 *
 * @param {string} hash - A transaction hash
 * @param {array} array - An array of transactions
 *
 * @return {number} - The index of the transaction
 */
const getTransactionIndex = function (hash, array) {
  let i = null;
  for (i = 0; array.length > i; i++) {
    if (array[i].meta.hash.data === hash) {
      return i;
    }
  }
  return 0;
};

/**
 * Check if a cosignatory is already present in modifications array
 *
 * @param {string} pubKey - A cosignatory public key
 * @param {array} array - A modifications array
 *
 * @return {boolean} - True if present, false otherwise
 */
const haveCosig = function (pubKey, array) {
  let i = null;
  for (i = 0; array.length > i; i++) {
    if (array[i].cosignatoryAccount === pubKey) {
      return true;
    }
  }
  return false;
};

/** *
 * NEM epoch time
 *
 * @type {number}
 */
const NEM_EPOCH = Date.UTC(2015, 2, 29, 0, 6, 25, 0);

/**
 * Create a time stamp for a NEM transaction
 *
 * @return {number} - The NEM transaction time stamp in milliseconds
 */
const createNEMTimeStamp = function () {
  return Math.floor((Date.now() / 1000) - (NEM_EPOCH / 1000));
};

/**
 * Fix a private key
 *
 * @param {string} privatekey - An hex private key
 *
 * @return {string} - The fixed hex private key
 */
const fixPrivateKey = function (privateKey) {
  return (`0000000000000000000000000000000000000000000000000000000000000000${privateKey.replace(/^00/, '')}`).slice(-64);
};

/**
 * Check if a private key is valid
 *
 * @param {string} privatekey - A private key
 *
 * @return {boolean} - True if valid, false otherwise
 */
const isPrivateKeyValid = function (privateKey) {
  if (privateKey.length !== 64 && privateKey.length !== 66) {
    console.error('Private key length must be 64 or 66 characters !');
    return false;
  } else if (!isHexadecimal(privateKey)) {
    console.error('Private key must be hexadecimal only !');
    return false;
  }
  return true;
};

/**
 * Check if a public key is valid
 *
 * @param {string} publicKey - A public key
 *
 * @return {boolean} - True if valid, false otherwise
 */
const isPublicKeyValid = function (publicKey) {
  if (publicKey.length !== 64) {
    console.error('Public key length must be 64 or 66 characters !');
    return false;
  } else if (!isHexadecimal(publicKey)) {
    console.error('Public key must be hexadecimal only !');
    return false;
  }
  return true;
};

/**
 * Create a time stamp
 *
 * @return {object} - A date object
 */
const createTimeStamp = function () {
  return new Date();
};

/**
 * Date object to YYYY-MM-DD format
 *
 * @param {object} date - A date object
 *
 * @return {string} - The short date
 */
const getTimestampShort = function (date) {
  let dd = date.getDate();
  let mm = date.getMonth() + 1; // January is 0!
  const yyyy = date.getFullYear();

  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }

  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Date object to date string
 *
 * @param {object} date - A date object
 *
 * @return {string} - The date string
 */
const convertDateToString = function (date) {
  return date.toDateString();
};

/**
 * Mimics jQuery's extend function
 *
 * http://stackoverflow.com/a/11197343
 */
/* eslint-disable */
const extendObj = function (...args) {
  for (let i = 1; i < args.length; i++) {
    for (const key in args[i]) {
      if (args[i].hasOwnProperty(key)) {
        args[0][key] = args[i][key];
      }
    }
  }
  return args[0];
};
/* eslint-enable */

/**
 * Search for mosaic definition(s) into an array of mosaicDefinition objects
 *
 * @param {array} mosaicDefinitionArray - An array of mosaicDefinition objects
 * @param {array} keys - Array of strings with names of the mosaics to find (['eur', 'usd',...])
 *
 * @return {object} - An object of mosaicDefinition objects
 */
const searchMosaicDefinitionArray = function (mosaicDefinitionArray, keys) {
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    for (let k = 0; k < mosaicDefinitionArray.length; k++) {
      if (mosaicDefinitionArray[k].mosaic.id.name === keys[i]) {
        result[Format.mosaicIdToName(mosaicDefinitionArray[k].mosaic.id)] = mosaicDefinitionArray[k].mosaic;
      }
    }
  }
  return result;
};

/**
 * Mimics jQuery's grep function
 */
/* eslint-disable */
const grep = function (items, callback) {
  let filtered = [],
    len = items.length,
    i = 0;
  for (i; i < len; i++) {
    const item = items[i];
    const cond = callback(item);
    if (cond) {
      filtered.push(item);
    }
  }

  return filtered;
};
/* eslint-enable */

/**
 * Check if a text input amount is valid
 *
 * @param {string} n - The number as a string
 *
 * @return {boolean} - True if valid, false otherwise
 */
const isTextAmountValid = function (n) {
  // Force n as a string and replace decimal comma by a dot if any
  const nn = Number(n.toString().replace(/,/g, '.'));
  return !Number.isNaN(nn) && Number.isFinite(nn) && nn >= 0;
};

/**
 * Clean a text input amount and return it as number
 *
 * @param {string} n - The number as a string
 *
 * @return {number} - The clean amount
 */
const cleanTextAmount = function (n) {
  return Number(n.toString().replace(/,/g, '.'));
};

/**
 * Convert an endpoint object to an endpoint url
 *
 * @param {object} endpoint - An endpoint object
 *
 * @return {String} - An endpoint url
 */
const formatEndpoint = function (endpoint) {
  return `${endpoint.host}:${endpoint.port}`;
};

/**
 * Check if data is JSON
 *
 * @param {anything} data - Data to test
 *
 * @return {boolean} - True if JSON, false otherwise
 */
const isJSON = function (data) {
  try {
    JSON.parse(data);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  needsSignature,
  haveTx,
  getTransactionIndex,
  haveCosig,
  createNEMTimeStamp,
  fixPrivateKey,
  isPrivateKeyValid,
  isPublicKeyValid,
  createTimeStamp,
  getTimestampShort,
  convertDateToString,
  extendObj,
  isHexadecimal,
  searchMosaicDefinitionArray,
  grep,
  isTextAmountValid,
  cleanTextAmount,
  formatEndpoint,
  isJSON,
};
