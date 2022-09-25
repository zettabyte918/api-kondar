"use strict";

/**
 * payment service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::payment.payment", ({ strapi }) => ({
  getAllPaymentForSpecificUser: async (ctx, id) => {
    try {
      const payments = await strapi.db.query("api::payment.payment").findMany({
        select: ["debut", "fin"],
        where: {
          student: id,
        },
        populate: {
          student: {
            select: ["name_eleve"],
          },
        },
      });
      if (!payments) return ctx.notFound("il n'y a pas de paiements");

      ctx.body = payments;
    } catch (err) {
      ctx.body = err;
    }
  },
}));
