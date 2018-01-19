import convert from './convert';
import Address from '../model/address';
import TransactionTypes from '../model/transactionTypes';

/**
 * Return mosaic name from mosaicId object
 *
 * @param {object} mosaicId - A mosaicId object
 *
 * @return {string} - The mosaic name
 */
const mosaicIdToName = function (mosaicId) {
  if (!mosaicId) return mosaicId;
  return `${mosaicId.namespaceId}:${mosaicId.name}`;
};


/**
* Convert a public key to NEM address
*
* @param {string} input - The account public key
* @param {number} networkId - The current network id
*
* @return {string} - A clean NEM address
*/
const pubToAddress = function (input, networkId) {
  return input && Address.toAddress(input, networkId);
};

/**
* Add hyphens to a clean address
*
* @param {string} input - A NEM address
*
* @return {string} - A formatted NEM address
*/
const address = function (input) {
  return input && input.toUpperCase().replace(/-/g, '').match(/.{1,6}/g).join('-');
};

/**
* Format a timestamp to NEM date
*
* @param {number} data - A timestamp
*
* @return {string} - A date string
*/
const nemDate = function (data) {
  const nemesis = Date.UTC(2015, 2, 29, 0, 6, 25);
  if (data === undefined) return data;
  const o = data;
  const t = (new Date(nemesis + o * 1000));
  return t.toUTCString();
};

const supply = function (data, mosaicId, mosaics) {
  if (data === undefined) return data;
  const mosaicName = mosaicIdToName(mosaicId);
  if (!(mosaicName in mosaics)) {
    return ['unknown mosaic divisibility', data];
  }
  const mosaicDefinitionMetaDataPair = mosaics[mosaicName];
  const divisibilityProperties = $.grep(mosaicDefinitionMetaDataPair.mosaicDefinition.properties, w => w.name === 'divisibility');
  const divisibility = divisibilityProperties.length === 1 ? ~~(divisibilityProperties[0].value) : 0;
  let o = parseInt(data, 10);
  if (!o) {
    if (divisibility === 0) {
      return ['0', ''];
    }
    return ['0', o.toFixed(divisibility).split('.')[1]];
  }
  o /= 10 ** divisibility;
  const b = o.toFixed(divisibility).split('.');
  const r = b[0].split(/(?=(?:...)*$)/).join(' ');
  return [r, b[1] || ''];
};

const supplyRaw = function (data, _divisibility) {
  const divisibility = ~~_divisibility;
  let o = parseInt(data, 10);
  if (!o) {
    if (divisibility === 0) {
      return ['0', ''];
    }
    return ['0', o.toFixed(divisibility).split('.')[1]];
  }
  o /= 10 ** divisibility;
  const b = o.toFixed(divisibility).split('.');
  const r = b[0].split(/(?=(?:...)*$)/).join(' ');
  return [r, b[1] || ''];
};

const levyFee = function (mosaic, multiplier, levy, mosaics) {
  if (mosaic === undefined || mosaics === undefined) return mosaic;
  if (levy === undefined || levy.type === undefined) return undefined;
  let levyValue;
  if (levy.type === 1) {
    levyValue = levy.fee;
  } else {
    // Note, multiplier is in micro NEM
    levyValue = (multiplier / 1000000) * mosaic.quantity * levy.fee / 10000;
  }
  const r = supply(levyValue, levy.mosaicId, mosaics);
  return `${r[0]}.${r[1]}`;
};

/**
* Format a NEM importance score
*
* @param {number} data -  The importance score
*
* @return {array} - A formatted importance score at 10^-4
*/
const nemImportanceScore = function (data) {
  if (data === undefined) return data;
  let o = data;
  if (o) {
    o *= 10000;
    o = o.toFixed(4).split('.');
    return [o[0], o[1]];
  }
  return [o, 0];
};

/**
* Format a value to NEM value
*
* @param {number} data - An amount of XEM
*
* @return {array} - An array with values before and after decimal point
*/
const nemValue = function (data) {
  if (data === undefined) return data;
  let o = data;
  if (!o) {
    return ['0', '000000'];
  }
  o /= 1000000;
  const b = o.toFixed(6).split('.');
  const r = b[0].split(/(?=(?:...)*$)/).join(' ');
  return [r, b[1]];
};

/**
* Return name of an importance transfer mode
*
* @return {string} - An importance transfer mode name
*/
const importanceTransferMode = function (data) {
  if (data === undefined) return data;
  const o = data;
  if (o === 1) return 'Activation';
  else if (o === 2) return 'Deactivation';
  return 'Unknown';
};

/**
* Convert hex to utf8
*
* @param {string} data - Hex data
*
* @return {string} result - Utf8 string
*/
const hexToUtf8 = function (data) {
  if (data === undefined) return data;
  const o = data;
  if (o && o.length > 2 && o[0] === 'f' && o[1] === 'e') {
    return `HEX: ${o.slice(2)}`;
  }
  let result;
  try {
    result = decodeURIComponent(escape(convert.hex2a(o)));
  } catch (e) {
    // result = "Error, message not properly encoded !";
    result = convert.hex2a(o);
    console.log(`invalid text input: ${data}`);
  }
  // console.log(decodeURIComponent(escape( convert.hex2a(o) )));*/
  // result = convert.hex2a(o);
  return result;
};

/**
* Verify if message is not encrypted and return utf8
*
* @param {object} msg - A message object
*
* @return {string} result - Utf8 string
*/
const hexMessage = function (msg) {
  if (msg === undefined) return msg;
  if (msg.type === 1) {
    return hexToUtf8(msg.payload);
  }
  return '';
};

/**
* Split hex string into 64 characters segments
*
* @param {string} data - An hex string
*
* @return {array} - A segmented hex string
*/
const splitHex = function (data) {
  if (data === undefined) return data;
  const parts = data.match(/[\s\S]{1,64}/g) || [];
  const r = parts.join('\n');
  return r;
};

/**
 * Return the name of a transaction type id
 *
 * @param {number} id - A transaction type id
 *
 * @return {string} - The transaction type name
 */
const txTypeToName = function (id) {
  switch (id) {
    case TransactionTypes.transfer:
      return 'Transfer';
    case TransactionTypes.importanceTransfer:
      return 'ImportanceTransfer';
    case TransactionTypes.multisigModification:
      return 'MultisigModification';
    case TransactionTypes.provisionNamespace:
      return 'ProvisionNamespace';
    case TransactionTypes.mosaicDefinition:
      return 'MosaicDefinition';
    case TransactionTypes.mosaicSupply:
      return 'MosaicSupply';
    default:
      return `Unknown_${id}`;
  }
};

module.exports = {
  splitHex,
  hexMessage,
  hexToUtf8,
  importanceTransferMode,
  nemValue,
  nemImportanceScore,
  levyFee,
  supplyRaw,
  supply,
  nemDate,
  pubToAddress,
  address,
  mosaicIdToName,
  txTypeToName,
};
