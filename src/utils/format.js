import convert from './convert';
import Address from '../model/address';
import TransactionTypes from '../model/transactionTypes';

/**
* Convert a public key to NEM address
*
* @param {string} input - The account public key
* @param {number} networkId - The current network id
*
* @return {string} - A clean NEM address
*/
let pubToAddress = function(input, networkId) {
    return input && Address.toAddress(input, networkId);
}

/**
* Add hyphens to a clean address
*
* @param {string} input - A NEM address
*
* @return {string} - A formatted NEM address
*/
let address = function(input) {
    return input && input.toUpperCase().replace(/-/g, '').match(/.{1,6}/g).join('-');
}

/**
* Format a timestamp to NEM date
*
* @param {number} data - A timestamp
*
* @return {string} - A date string
*/
let nemDate = function(data) {
    let nemesis = Date.UTC(2015, 2, 29, 0, 6, 25);
    if (data === undefined) return data;
    let o = data;
    let t = (new Date(nemesis + o * 1000));
    return t.toUTCString();
}

let supply = function(data, mosaicId, mosaics) {
    if (data === undefined) return data;
    let mosaicName = mosaicIdToName(mosaicId);
    if (!(mosaicName in mosaics)) {
        return ['unknown mosaic divisibility', data];
    }
    let mosaicDefinitionMetaDataPair = mosaics[mosaicName];
    let divisibilityProperties = $.grep(mosaicDefinitionMetaDataPair.mosaicDefinition.properties, function(w) {
        return w.name === "divisibility";
    });
    let divisibility = divisibilityProperties.length === 1 ? ~~(divisibilityProperties[0].value) : 0;
    let o = parseInt(data, 10);
    if (!o) {
        if (divisibility === 0) {
            return ["0", ''];
        } else {
            return ["0", o.toFixed(divisibility).split('.')[1]];
        }
    }
    o = o / Math.pow(10, divisibility);
    let b = o.toFixed(divisibility).split('.');
    let r = b[0].split(/(?=(?:...)*$)/).join(" ");
    return [r, b[1] || ""];
}

let supplyRaw = function(data, _divisibility) {
    let divisibility = ~~_divisibility;
    let o = parseInt(data, 10);
    if (!o) {
        if (divisibility === 0) {
            return ["0", ''];
        } else {
            return ["0", o.toFixed(divisibility).split('.')[1]];
        }
    }
    o = o / Math.pow(10, divisibility);
    let b = o.toFixed(divisibility).split('.');
    let r = b[0].split(/(?=(?:...)*$)/).join(" ");
    return [r, b[1] || ""];
}

let levyFee = function(mosaic, multiplier, levy, mosaics) {
        if (mosaic === undefined || mosaics === undefined) return mosaic;
        if (levy === undefined || levy.type === undefined) return undefined;
        let levyValue;
        if (levy.type === 1) {
            levyValue = levy.fee;
        } else {
            // Note, multiplier is in micro NEM
            levyValue = (multiplier / 1000000) * mosaic.quantity * levy.fee / 10000;
        }
        let r = supply(levyValue, levy.mosaicId, mosaics);
        return r[0] + "." + r[1];
    };

/**
* Format a NEM importance score
*
* @param {number} data -  The importance score
*
* @return {array} - A formatted importance score at 10^-4
*/
let nemImportanceScore = function(data) {
    if (data === undefined) return data;
    let o = data;
    if (o) {
        o *= 10000;
        o = o.toFixed(4).split('.');
        return [o[0], o[1]];
    }
    return [o, 0];
}

/**
* Format a value to NEM value
*
* @param {number} data - An amount of XEM
*
* @return {array} - An array with values before and after decimal point
*/
let nemValue = function(data) {
    if (data === undefined) return data;
        let o = data;
        if (!o) {
            return ["0", '000000'];
        } else {
            o = o / 1000000;
            let b = o.toFixed(6).split('.');
            let r = b[0].split(/(?=(?:...)*$)/).join(" ");
            return [r, b[1]];
    }
}

/**
* Return name of an importance transfer mode
*
* @return {string} - An importance transfer mode name
*/
let importanceTransferMode = function(data) {
    if (data === undefined) return data;
    let o = data;
    if (o === 1) return "Activation";
    else if (o === 2) return "Deactivation";
    else return "Unknown";
}

/**
* Convert hex to utf8
*
* @param {string} data - Hex data
*
* @return {string} result - Utf8 string
*/
let hexToUtf8 = function(data) {
    if (data === undefined) return data;
    let o = data;
    if (o && o.length > 2 && o[0] === 'f' && o[1] === 'e') {
        return "HEX: " + o.slice(2);
    }
    let result;
    try {
        result = decodeURIComponent(escape(convert.hex2a(o)))
    } catch (e) {
        //result = "Error, message not properly encoded !";
        result = convert.hex2a(o);
        console.log('invalid text input: ' + data);
    }
    //console.log(decodeURIComponent(escape( convert.hex2a(o) )));*/
    //result = convert.hex2a(o);
    return result;
}

/**
* Verify if message is not encrypted and return utf8
*
* @param {object} msg - A message object
*
* @return {string} result - Utf8 string
*/
let hexMessage = function(msg) {
    if (msg === undefined) return msg;
    if (msg.type === 1) {
        return hexToUtf8(msg.payload);
    } else {
        return '';
    }
};

/**
* Split hex string into 64 characters segments
*
* @param {string} data - An hex string
*
* @return {array} - A segmented hex string
*/
let splitHex = function(data) {
    if (data === undefined) return data;
    let parts = data.match(/[\s\S]{1,64}/g) || [];
    let r = parts.join("\n");
    return r;
}

/**
 * Return mosaic name from mosaicId object
 *
 * @param {object} mosaicId - A mosaicId object
 *
 * @return {string} - The mosaic name
 */
let mosaicIdToName = function(mosaicId) {
    if (!mosaicId) return mosaicId;
    return mosaicId.namespaceId + ":" + mosaicId.name;
}

/**
 * Return the name of a transaction type id
 *
 * @param {number} id - A transaction type id
 *
 * @return {string} - The transaction type name
 */
let txTypeToName = function(id) {
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
            return 'Unknown_' + id;
    }
}

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
    txTypeToName
}