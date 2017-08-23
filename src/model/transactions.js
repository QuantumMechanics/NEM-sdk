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
let prepare = function(objectName) {
    switch(objectName) {
        case "transferTransaction":
            return TransferTransaction.prepare;
            break;
        case "mosaicTransferTransaction":
            return TransferTransaction.prepareMosaic;
            break;
        case "mosaicDefinitionTransaction":
            return MosaicDefinitionTransaction.prepare;
            break;
        case "multisigAggregateModificationTransaction":
            return MultisigAggregateModification.prepare;
            break;
        case "namespaceProvisionTransaction":
            return NamespaceProvisionTransaction.prepare;
            break;
        case "signatureTransaction":
            return SignatureTransaction.prepare;
            break;
        case "mosaicSupplyChangeTransaction":
            return MosaicSupplyChangeTransaction.prepare;
            break;
        case "importanceTransferTransaction":
            return ImportanceTransferTransaction.prepare;
            break;
        default:
            return {};
    }
}

module.exports = {
    prepare,
    send: Send,
    prepareMessage: Message.prepare
}