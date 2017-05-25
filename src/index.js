import { create as createKeyPair } from './crypto/keyPair';
import { verifySignature } from './crypto/keyPair';
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
import websockets from './com/websockets';
import apostille from './model/apostille';

export default {
	crypto: {
		keyPair: {
			create: createKeyPair
		},
		helpers: cryptoHelpers,
		nacl,
		js: CryptoJS,
		verifySignature: verifySignature
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
		fees,
		apostille
	},
	utils: {
		convert,
		helpers,
		nty,
		serialization,
		format
	},
	com: {
		requests,
		websockets
	}
};
