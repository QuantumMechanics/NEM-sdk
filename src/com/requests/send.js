import Helpers from "../../utils/helpers";
import axios from "axios";

/**
 * Send a request
 *
 * @param {object} options - The options of the request
 *
 * @return {Promise} - A resolved promise with the requested data or a rejection with error data
 */
let send = function (options) {
  return new Promise((resolve, reject) => {
    axios(options)
      .then(function (response) {
        if (response.status == 200) {
          let data;
          if (Helpers.isJSON(response.data)) {
            data = JSON.parse(response.data);
          } else {
            data = response.data;
          }
          resolve(data);
        }
      })
      .catch(function (error) {
        reject({ code: -1, data: error });
      });
  });
};

export default send;
