"use strict";

/**
 *  payment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::payment.payment", ({ strapi }) => ({
  getAllPaymentForSpecificUser: async (ctx) => {
    const { id } = ctx.params;

    try {
      const payments = await strapi.db.query("api::payment.payment").findMany({
        select: ["debut", "fin"],
        where: {
          student: id,
        },
      });
      if (!payments) return ctx.notFound("il n'y a pas de paiements");

      ctx.body = payments;
    } catch (err) {
      ctx.body = err;
    }
  },
  addPayment: async (ctx) => {
    const { body } = ctx.request;

    try {
      const payment = await strapi.db.query("api::payment.payment").create({
        data: {
          debut: body.data.debut,
          fin: body.data.fin,
          student: body.data.student,
        },
      });
      if (!payment) return ctx.notFound("il n'y a pas de paiements");

      ctx.body = payment;
    } catch (err) {
      ctx.body = err;
    }
  },
}));
