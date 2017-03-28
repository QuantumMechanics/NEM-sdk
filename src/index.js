import keyPair from './crypto/keyPair';
import address from './model/address';
import convert from './utils/convert';
import format from './utils/format';
import nacl from './external/nacl-fast';
import network from './model/network';
import cryptoHelpers from './crypto/cryptoHelpers';
import helpers from './utils/helpers';
import nty from './utils/nty';
import serialization from './utils/serialization';
import transactionTypes from './model/transactionTypes';
import nodes from './model/nodes';
import sinks from './model/sinks';
import wallet from './model/wallet';
import transactions from './model/transactions';
import objects from './model/objects';
import requests from './com/requests';
import fees from './model/fees';
import CryptoJS from 'crypto-js';

export default {
	crypto: {
		keyPair,
		helpers: cryptoHelpers,
		nacl,
		js: CryptoJS
	},
	model: {
		address,
		network,
		nodes,
		transactionTypes,
		sinks,
		wallet,
		transactions,
		objects,
		fees
	},
	utils: {
		convert,
		helpers,
		nty,
		serialization,
		format
	},
	com: {
		requests
	}
};
