import Account from './objects/account';
import Miscellaneous from './objects/miscellaneous';
import Mosaic from './objects/mosaic';
import Transactions from './objects/transactions';
import QR from './objects/qr';
import Wallet from './objects/wallet';

/**
 * Get an empty object 
 *
 * @param {string} objectName - The name of the object
 *
 * @return {object} - The desired object
 */
let get = function(objectName) {
    return _fetch(0, objectName);
}

/**
 * Create an object
 *
 * @param {string} objectName - The name of the object
 *
 * @return {function} - The object creation function corresponding to the object name
 */
let create = function(objectName) {
    return _fetch(1, objectName);
}

/**
 * Fetch objects
 *
 * @param {number} type - 0 for get, 1 for creation
 * @param {string} objectName - The name of the object
 *
 * @return {function|object} - The object creation function corresponding to the object name, or the object
 */
let _fetch = function(type, objectName) {
    switch(objectName) {
        case "account":
            return !type ? Account() : Account;
            break;
        case "accountInfoQR":
            return !type ? QR.accountInfo(): QR.accountInfo;
            break;
        case "common":
            return !type ? Miscellaneous.common() : Miscellaneous.common;
            break;
        case "commonTransactionPart":
            return !type ? Transactions.commonPart() : Transactions.commonPart;
            break;
        case "endpoint":
            return !type ? Miscellaneous.endpoint() : Miscellaneous.endpoint;
            break;
        case "mosaicAttachment":
            return !type ? Mosaic.attachment() : Mosaic.attachment;
            break;
        case "mosaicDefinitionMetaDataPair":
            return Mosaic.definitionMetaDataPair();
            break;
        case "mosaicDefinitionTransaction":
            return !type ? Transactions.mosaicDefinition() : Transactions.mosaicDefinition;
            break;
        case "invoice":
            return !type ? QR.invoice() : QR.invoice;
            break;
        case "transferTransaction":
            return !type ? Transactions.transfer() : Transactions.transfer;
            break;
        case "signatureTransaction":
            return !type ? Transactions.signature() : Transactions.signature;
            break;
        case "messageTypes":
            return Miscellaneous.messageTypes();
            break;
        case "mosaicSupplyChangeTransaction":
            return !type ? Transactions.mosaicSupplyChange() : Transactions.mosaicSupplyChange;
            break;
        case "multisigAggregateModification":
            return !type ? Transactions.multisigAggregateModification() : Transactions.multisigAggregateModification;
            break;
        case "multisigCosignatoryModification":
            return !type ? Miscellaneous.multisigCosignatoryModification() : Miscellaneous.multisigCosignatoryModification;
            break;
        case "namespaceProvisionTransaction":
            return !type ? Transactions.namespaceProvision() : Transactions.namespaceProvision;
            break;
        case "importanceTransferTransaction":
            return !type ? Transactions.importanceTransfer() : Transactions.importanceTransfer;
            break;
        case "wallet":
            return !type ? Wallet() : Wallet;
            break;
        case "walletQR":
            return !type ? QR.wallet() : QR.wallet;
            break;
        default:
            return {};
    }
}

module.exports = {
    get,
    create
}