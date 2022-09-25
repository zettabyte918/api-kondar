module.exports = {
  routes: [
    {
      method: "GET",
      path: "/sms/token",
      handler: "sms.getTokenSMS",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/sms/balance/:token",
      handler: "sms.getBalance",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
  ],
};
