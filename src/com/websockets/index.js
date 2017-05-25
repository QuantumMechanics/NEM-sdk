import connector from './connector';
import account from './account';
import chain from './chain';
import errors from './errors';

export default {
	connector: connector,
	requests: {
		account: account.requests,
		chain: chain.requests
	},
	subscribe: {
		account: account.subscribe,
		chain: chain.subscribe,
		errors: errors.subscribe
	}
}