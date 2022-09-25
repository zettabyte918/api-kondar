module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/payments/:id",
      handler: "payment.getAllPaymentForSpecificUser",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      // Path defined with a URL parameter
      method: "POST",
      path: "/payments/addpayment",
      handler: "payment.addPayment",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
  ],
};
