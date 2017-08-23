import Network from '../network';
import Helpers from '../../utils/helpers';
import TransactionTypes from '../transactionTypes';
import KeyPair from '../../crypto/keyPair';
import Fees from '../fees';
import Objects from '../objects';
import Address from '../address';
import MultisigWrapper from './multisigWrapper';

/**
 * Prepare a multisig aggregate modification transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared multisigAggregateModificationTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MultisigAggregateModificationTransaction]{@link http://bob.nem.ninja/docs/#multisigAggregateModificationTransaction} object ready for serialization
 */
let prepare = function(common, tx, network) {
    if (!common || !tx || !network) throw new Error('Missing parameter !');
    let kp = KeyPair.create(Helpers.fixPrivateKey(common.privateKey));
    let actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    let due = network === Network.data.testnet.id ? 60 : 24 * 60;
    let entity = _construct(actualSender, tx.modifications, tx.relativeChange, tx.isMultisig, due, network);
    if (tx.isMultisig) {
        entity = MultisigWrapper(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
}

/**
 * Create a multisignature aggregate modification transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {array} modifications - An array of [MultisigCosignatoryModification]{@link http://bob.nem.ninja/docs/#multisigCosignatoryModification} objects  
 * @param {number} relativeChange - The number of signature to add or remove (ex: 1 to add +1 or -1 to remove one)
 * @param {boolean} isMultisig - True if transaction is multisig, false otherwise
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [MultisigAggregateModificationTransaction]{@link http://bob.nem.ninja/docs/#multisigAggregateModificationTransaction} object
 */
let _construct = function(senderPublicKey, modifications, relativeChange, isMultisig, due, network) {
    let timeStamp = Helpers.createNEMTimeStamp();
    let hasNoRelativeChange = relativeChange === null || relativeChange === 0;
    let version = hasNoRelativeChange ? Network.getVersion(1, network) : Network.getVersion(2, network);
    let data = Objects.create("commonTransactionPart")(TransactionTypes.multisigModification, senderPublicKey, timeStamp, due, version);
    let totalFee = Fees.multisigAggregateModificationTransaction;
    let custom = {
        'fee': totalFee,
        'modifications': modifications,
        'minCosignatories': {
            'relativeChange': 0
        }
    }
    // If multisig, it is a modification of an existing contract, otherwise it is a creation
    if(isMultisig) {
        // If no relative change, no minCosignatories property
        if (hasNoRelativeChange) delete custom.minCosignatories;
        else custom.minCosignatories.relativeChange = relativeChange;

        // Sort modification array
        if (custom.modifications.length > 1) {
            custom.modifications.sort((a, b) => {
                return a.modificationType - b.modificationType || Address.toAddress(a.cosignatoryAccount, network).localeCompare(Address.toAddress(b.cosignatoryAccount, network));
            });
        }
    } else {
        custom.minCosignatories.relativeChange = relativeChange;

        // Sort modification array by addresses
        if (custom.modifications.length > 1) {
            custom.modifications.sort((a, b) => {
                if (Address.toAddress(a.cosignatoryAccount, network) < Address.toAddress(b.cosignatoryAccount, network)) return -1;
                if (Address.toAddress(a.cosignatoryAccount, network) > Address.toAddress(b.cosignatoryAccount, network)) return 1;
                return 0;
            });
        }
    }

    let entity = Helpers.extendObj(data, custom);
    return entity;
}

module.exports = {
    prepare
}