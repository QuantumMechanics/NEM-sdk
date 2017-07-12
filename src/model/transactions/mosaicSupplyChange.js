import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import KeyPair from '../../crypto/keyPair';
import Objects from '../objects';
import MultisigWrapper from './multisigWrapper';

/**
 * Prepare a mosaic supply change transaction
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared mosaicSupplyChangeTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicSupplyChangeTransaction]{@link http://bob.nem.ninja/docs/#mosaicSupplyChangeTransaction} object ready for serialization
 */
let prepare = function(common, tx, network) {
    let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    let due = network === Network.data.testnet.id ? 60 : 24 * 60;
    let entity = _construct(actualSender, tx.mosaic, tx.supplyType, tx.delta, due, network);
    if (tx.isMultisig) {
        entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
}

/***
 * Create a mosaic supply change transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {object} mosaicId - The mosaic id
 * @param {number} supplyType - The type of change
 * @param {number} delta - The amount involved in the change
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicSupplyChangeTransaction]{@link http://bob.nem.ninja/docs/#mosaicSupplyChangeTransaction} object
 */
let _construct = function(senderPublicKey, mosaicId, supplyType, delta, due, network) {
    let timeStamp = Helpers.createNEMTimeStamp();
    let version = Network.getVersion(1, network);
    let data = Objects.create("commonTransactionPart")(TransactionTypes.mosaicSupply, senderPublicKey, timeStamp, due, version);
    let fee = Fees.namespaceAndMosaicCommon;
    let custom = {
        'mosaicId': mosaicId,
        'supplyType': supplyType,
        'delta': delta,
        'fee': fee
    };
    let entity = Helpers.extendObj(data, custom);
    return entity;
};

module.exports = {
    prepare
}