"use strict";
var axios = require("axios");
var qs = require("qs");
/**
 * A set of functions called "actions" for `sms`
 */

module.exports = {
  getTokenSMS: async () => {
    var data = qs.stringify({
      grant_type: "client_credentials",
    });

    var config = {
      method: "post",
      url: "https://api.orange.com/oauth/v3/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic ZTdrV0RKSHA5U05RZ1F0RmdIU21OMnB0Q05BMFZaSEc6WXFQaFpUWVV4SWRDVkJUbw==",
      },
      data: data,
    };

    const response = await axios(config)
      .then(function (response) {
        return JSON.stringify(response.data);
      })
      .catch(function (error) {
        return error;
      });

    return response;
  },

  getBalance: async (ctx) => {
    const { token } = ctx.params; // get token from the frontend in the url

    var config = {
      method: "get",
      url: "https://api.orange.com/sms/admin/v1/contracts",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: "",
    };

    const response = await axios(config)
      .then(function (response) {
        return JSON.stringify(response.data);
      })
      .catch(function (error) {
        return error;
      });

    return response;
  },
};
