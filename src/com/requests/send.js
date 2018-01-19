import Request from 'request';
import Helpers from '../../utils/helpers';

/**
 * Send a request
 *
 * @param {object} options - The options of the request
 *
 * @return {Promise} - A resolved promise with the requested data or a rejection with error data
 */
const send = function (options) {
  return new Promise((resolve, reject) => {
    Request(options, (error, response, body) => {
      let data;
      if (Helpers.isJSON(body)) {
        data = JSON.parse(body);
      } else {
        data = body;
      }
      if (!error && response.statusCode === 200) {
        resolve(data);
      } else if (!error) {
        reject({ code: 0, data });
      } else {
        reject({ code: -1, data: error });
      }
    });
  });
};

export default send;
