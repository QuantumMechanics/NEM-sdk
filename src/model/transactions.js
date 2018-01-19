import TransferTransaction from './transactions/transferTransaction';
import SignatureTransaction from './transactions/signatureTransaction';
import MosaicDefinitionTransaction from './transactions/mosaicDefinitionTransaction';
import MosaicSupplyChangeTransaction from './transactions/mosaicSupplyChange';
import MultisigAggregateModification from './transactions/multisigAggregateModificationTransaction';
import NamespaceProvisionTransaction from './transactions/namespaceProvisionTransaction';
import ImportanceTransferTransaction from './transactions/importanceTransferTransaction';
import Send from './transactions/send';
import Message from './transactions/message';

/**
 * Prepare a transaction object
 *
 * @param {string} objectName - The name of the object to prepare
 *
 * @retrun {function} - The prepare function corresponding to the object name
 */
const prepare = function (objectName) {
  switch (objectName) {
    case 'transferTransaction':
      return TransferTransaction.prepare;
    case 'mosaicTransferTransaction':
      return TransferTransaction.prepareMosaic;
    case 'mosaicDefinitionTransaction':
      return MosaicDefinitionTransaction.prepare;
    case 'multisigAggregateModificationTransaction':
      return MultisigAggregateModification.prepare;
    case 'namespaceProvisionTransaction':
      return NamespaceProvisionTransaction.prepare;
    case 'signatureTransaction':
      return SignatureTransaction.prepare;
    case 'mosaicSupplyChangeTransaction':
      return MosaicSupplyChangeTransaction.prepare;
    case 'importanceTransferTransaction':
      return ImportanceTransferTransaction.prepare;
    default:
      return {};
  }
};

module.exports = {
  prepare,
  send: Send,
  prepareMessage: Message.prepare,
};
