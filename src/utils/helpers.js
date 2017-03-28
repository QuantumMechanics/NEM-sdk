import convert from './convert';
import CryptoHelpers from '../crypto/cryptoHelpers';
import TransactionTypes from '../model/transactionTypes';

/**
 * Check if wallet already present in an array
 *
 * @param {string} walletName - A wallet name
 * @param {array} array - A wallets array
 *
 * @return {boolean} - True if present, false otherwise
 */
let haveWallet = function(walletName, array) {
    let i = null;
    for (i = 0; array.length > i; i++) {
        if (array[i].name === walletName) {
            return true;
        }
    }
    return false;
}

/**
 * Check if a multisig transaction needs signature
 *
 * @param {object} multisigTransaction - A multisig transaction
 * @param {object} data - An account data
 *
 * @return {boolean} - True if it needs signature, false otherwise
 */
let needsSignature = function(multisigTransaction, data) {
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
    } else {
        for (let k = 0; k < data.meta.cosignatoryOf.length; k++) {
            if (data.meta.cosignatoryOf[k].publicKey === multisigTransaction.transaction.otherTrans.signer) {
                return true;
            } else if (k === data.meta.cosignatoryOf.length - 1) {
                return false;
            }
        }
    }
    return true;
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
        case TransactionTypes.Transfer:
            return 'Transfer';
        case TransactionTypes.ImportanceTransfer:
            return 'ImportanceTransfer';
        case TransactionTypes.MultisigModification:
            return 'MultisigModification';
        case TransactionTypes.ProvisionNamespace:
            return 'ProvisionNamespace';
        case TransactionTypes.MosaicDefinition:
            return 'MosaicDefinition';
        case TransactionTypes.MosaicSupply:
            return 'MosaicSupply';
        default:
            return 'Unknown_' + id;
    }
}

/**
 * Check if a transaction is already present in an array of transactions
 *
 * @param {string} hash - A transaction hash
 * @param {array} array - An array of transactions
 *
 * @return {boolean} - True if present, false otherwise
 */
let haveTx = function(hash, array) {
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
let getTransactionIndex = function(hash, array) {
    let i = null;
    for (i = 0; array.length > i; i++) {
        if (array[i].meta.hash.data === hash) {
            return i;
        }
    }
    return 0;
};

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
 * Parse uri to get hostname
 *
 * @param {string} uri - An uri string
 *
 * @return {string} - The uri hostname
 */
let getHostname = function(uri) {
    let _uriParser = document.createElement('a');
    _uriParser.href = uri;
    return _uriParser.hostname;
}

/**
 * Check if a cosignatory is already present in modifications array
 *
 * @param {string} address - A cosignatory address
 * @param {string} pubKey - A cosignatory public key
 * @param {array} array - A modifications array
 *
 * @return {boolean} - True if present, false otherwise
 */
let haveCosig = function(address, pubKey, array) {
    let i = null;
    for (i = 0; array.length > i; i++) {
        if (array[i].address === address || array[i].pubKey === pubKey) {
            return true;
        }
    }
    return false;
};

/**
 * Remove extension of a file name
 *
 * @param {string} filename - A file name with extension
 *
 * @return {string} - The file name without extension
 */
let getFileName = function(filename) {
    return filename.replace(/\.[^/.]+$/, "");
};

/**
 * Gets extension of a file name
 *
 * @param {string} filename - A file name with extension
 *
 * @return {string} - The file name extension
 */
let getExtension = function(filename) {
    return filename.split('.').pop();
}

/***
 * NEM epoch time
 *
 * @type {number}
 */
let NEM_EPOCH = Date.UTC(2015, 2, 29, 0, 6, 25, 0);

/**
 * Create a time stamp for a NEM transaction
 *
 * @return {number} - The NEM transaction time stamp in milliseconds
 */
let createNEMTimeStamp = function() {
    return Math.floor((Date.now() / 1000) - (NEM_EPOCH / 1000));
}

/**
 * Fix a private key
 *
 * @param {string} privatekey - An hex private key
 *
 * @return {string} - The fixed hex private key
 */
let fixPrivateKey = function(privatekey) {
    return ("0000000000000000000000000000000000000000000000000000000000000000" + privatekey.replace(/^00/, '')).slice(-64);
}

/**
 * Build a message object
 *
 * @param {object} common - An object containing wallet private key
 * @param {object} tx - A transaction object containing the message
 *
 * @return {object} - The message object
 */
let prepareMessage = function(common, tx) {
    if (tx.encryptMessage && common.privateKey) {
        return {
            'type': 2,
            'payload': CryptoHelpers.encode(common.privateKey, tx.recipientPubKey, tx.message.toString())
        };
    } else {
        return {
            'type': 1,
            'payload': convert.utf8ToHex(tx.message.toString())
        };
    }
}

/**
 * Check and format an url
 *
 * @param {string} node - A custom node from user input
 * @param {number} defaultWebsocketPort - A default websocket port
 *
 * @return {string|number} - The formatted node as string or 1
 */
let checkAndFormatUrl = function (node, defaultWebsocketPort) {
    // Detect if custom node doesn't begin with "http://"
        var pattern = /^((http):\/\/)/;
        if (!pattern.test(node)) {
            node = "http://" + node;
            let _uriParser = document.createElement('a');
            _uriParser.href = node;
            // If no port we add it
            if (!_uriParser.port) {
                node = node + ":" + defaultWebsocketPort;
            } else if (_uriParser.port !== defaultWebsocketPort) {
                // Port is not default websocket port
                return 1;
            }
        } else {
            // Start with "http://""
            let _uriParser = document.createElement('a');
            _uriParser.href = node;
            // If no port we add it
            if (!_uriParser.port) {
                node = node + ":" + defaultWebsocketPort;
            } else if (_uriParser.port !== defaultWebsocketPort) {
                // Port is not default websocket port
                return 1;
            }
        }
        return node;
}
 
/**
 * Create a time stamp
 *
 * @return {object} - A date object
 */
let createTimeStamp = function() {
    return new Date();
}

/**
 * Date object to YYYY-MM-DD format
 *
 * @param {object} date - A date object
 *
 * @return {string} - The short date
 */
let getTimestampShort = function(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; //January is 0!
    let yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    return yyyy + '-' + mm + '-' + dd;
};

/**
 * Date object to date string
 *
 * @param {object} date - A date object
 *
 * @return {string} - The date string
 */
let convertDateToString = function(date) {
    return date.toDateString();
};

/**
 * Mimics jQuery's extend function
 *
 * http://stackoverflow.com/a/11197343
 */
let extendObj = function(){
    for(var i=1; i<arguments.length; i++) {
        for(var key in arguments[i]) {
            if(arguments[i].hasOwnProperty(key)) {
                arguments[0][key] = arguments[i][key];
            }
        }
    }
    return arguments[0];
}

/**
 * Test if a string is hexadecimal
 *
 * @param {string} str - A string to test
 *
 * @return {boolean} - True if correct, false otherwise
 */
let isHexadecimal = function(str) {
    return str.match('^(0x|0X)?[a-fA-F0-9]+$') !== null;
}

/**
 * Search for mosaic definition(s) into an array of mosaicDefinition objects
 *
 * @param {array} mosaicDefinitionArray - An array of mosaicDefinition objects
 * @param {array} keys - Array of strings with names of the mosaics to find (['eur', 'usd',...])
 *
 * @return {object} - An object of mosaicDefinition objects
 */
let searchMosaicDefinitionArray = function(mosaicDefinitionArray, keys) {
    let result = {}
    for (let i = 0; i < keys.length; i++) {
        for(let k = 0; k < mosaicDefinitionArray.length; k++) {
            if(mosaicDefinitionArray[k].mosaic.id.name === keys[i]) {
                result[mosaicIdToName(mosaicDefinitionArray[k].mosaic.id)] = mosaicDefinitionArray[k].mosaic;
            }
        }
    }
    return result;
}

/**
 * Mimics jQuery's grep function
 */
let grep = function(items, callback) {
    var filtered = [],
        len = items.length,
        i = 0;
    for (i; i < len; i++) {
        var item = items[i];
        var cond = callback(item);
        if (cond) {
            filtered.push(item);
        }
    }

    return filtered;
};

/**
 * Check if a text input amount is valid
 *
 * @param {string} n - The number as a string
 *
 * @return {boolean} - True if valid, false otherwise
 */
let isTextAmountValid = function(n) {
    // Force n as a string and replace decimal comma by a dot if any
    var nn = Number(n.toString().replace(/,/g, '.'));
    return !Number.isNaN(nn) && Number.isFinite(nn) && nn >= 0;
}

/**
 * Clean a text input amount and return it as number
 *
 * @param {string} n - The number as a string
 *
 * @return {number} - The clean amount
 */
let cleanTextAmount = function(n) {
    return Number(n.toString().replace(/,/g, '.'));
}

/**
 * Convert an endpoint object to an endpoint url
 *
 * @param {object} endpoint - An endpoint object
 *
 * @return {String} - An endpoint url
 */
let formatEndpoint = function(endpoint) {
    return endpoint.host + ':' + endpoint.port;
}

module.exports = {
    haveWallet,
    needsSignature,
    txTypeToName,
    haveTx,
    getTransactionIndex,
    mosaicIdToName,
    getHostname,
    haveCosig,
    getFileName,
    getExtension,
    createNEMTimeStamp,
    fixPrivateKey,
    prepareMessage,
    checkAndFormatUrl,
    createTimeStamp,
    getTimestampShort,
    convertDateToString,
    extendObj,
    isHexadecimal,
    searchMosaicDefinitionArray,
    grep,
    isTextAmountValid,
    cleanTextAmount,
    formatEndpoint
}