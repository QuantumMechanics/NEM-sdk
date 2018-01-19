import Account from './objects/account';
import Miscellaneous from './objects/miscellaneous';
import Mosaic from './objects/mosaic';
import Transactions from './objects/transactions';
import QR from './objects/qr';
import Wallet from './objects/wallet';


/**
 * Fetch objects
 *
 * @param {number} type - 0 for get, 1 for creation
 * @param {string} objectName - The name of the object
 *
 * @return {function|object} - The object creation function corresponding to the object name, or the object
 */
const _fetch = function (type, objectName) {
  switch (objectName) {
    case 'account':
      return !type ? Account() : Account;
    case 'accountInfoQR':
      return !type ? QR.accountInfo() : QR.accountInfo;
    case 'common':
      return !type ? Miscellaneous.common() : Miscellaneous.common;
    case 'commonTransactionPart':
      return !type ? Transactions.commonPart() : Transactions.commonPart;
    case 'endpoint':
      return !type ? Miscellaneous.endpoint() : Miscellaneous.endpoint;
    case 'mosaicAttachment':
      return !type ? Mosaic.attachment() : Mosaic.attachment;
    case 'mosaicDefinitionMetaDataPair':
      return Mosaic.definitionMetaDataPair();
    case 'mosaicDefinitionTransaction':
      return !type ? Transactions.mosaicDefinition() : Transactions.mosaicDefinition;
    case 'invoice':
      return !type ? QR.invoice() : QR.invoice;
    case 'transferTransaction':
      return !type ? Transactions.transfer() : Transactions.transfer;
    case 'signatureTransaction':
      return !type ? Transactions.signature() : Transactions.signature;
    case 'messageTypes':
      return Miscellaneous.messageTypes();
    case 'mosaicSupplyChangeTransaction':
      return !type ? Transactions.mosaicSupplyChange() : Transactions.mosaicSupplyChange;
    case 'multisigAggregateModification':
      return !type ? Transactions.multisigAggregateModification() : Transactions.multisigAggregateModification;
    case 'multisigCosignatoryModification':
      return !type ? Miscellaneous.multisigCosignatoryModification() : Miscellaneous.multisigCosignatoryModification;
    case 'namespaceProvisionTransaction':
      return !type ? Transactions.namespaceProvision() : Transactions.namespaceProvision;
    case 'importanceTransferTransaction':
      return !type ? Transactions.importanceTransfer() : Transactions.importanceTransfer;
    case 'wallet':
      return !type ? Wallet() : Wallet;
    case 'walletQR':
      return !type ? QR.wallet() : QR.wallet;
    default:
      return {};
  }
};

/**
 * Get an empty object
 *
 * @param {string} objectName - The name of the object
 *
 * @return {object} - The desired object
 */
const get = function (objectName) {
  return _fetch(0, objectName);
};

/**
 * Create an object
 *
 * @param {string} objectName - The name of the object
 *
 * @return {function} - The object creation function corresponding to the object name
 */
const create = function (objectName) {
  return _fetch(1, objectName);
};

module.exports = {
  get,
  create,
};
