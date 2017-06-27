import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import Fees from '../fees';
import KeyPair from '../../crypto/keyPair';
import Objects from '../objects';

/**
 * Prepare a signature transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared signature transaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MultisigSignatureTransaction]{@link http://bob.nem.ninja/docs/#multisigSignatureTransaction} object ready for serialization
 */
let prepare = function(common, tx, network) {
    if (!common || !tx || !network) throw new Error('Missing parameter !');
    let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let due = network === Network.data.testnet.id ? 60 : 24 * 60;

    let senderPublicKey = kp.publicKey.toString();
    let timeStamp = Helpers.createNEMTimeStamp();
    let version = Network.getVersion(1, network);
    let data = Objects.create("commonTransactionPart")(TransactionTypes.multisigSignature, senderPublicKey, timeStamp, due, version);
    let fee = Fees.signatureTransaction;

    let custom = {
        'fee': fee
    };
    let entity = Helpers.extendObj(tx, data, custom);
    return entity;
}

module.exports = {
    prepare
}

