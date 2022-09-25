"use strict";
const { sanitizeOutput } = require("../utils/sanitizeOutput");

/**
 *  groupe controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::groupe.groupe", ({ strapi }) => ({
  getAllGroupes: async (ctx) => {
    try {
      const groupes = await strapi.db.query("api::groupe.groupe").findMany({
        populate: {
          students: {
            select: ["name_eleve"],
            where: {
              role: {
                name: "Authenticated",
              },
              confirmed: true,
            },
            populate: {
              pack: {
                select: ["nom"],
              },
            },
          },
        },
      });
      if (!groupes)
        throw new ValidationError("Il n'y a pas de groupes disponibles");

      ctx.body = groupes;
    } catch (err) {
      ctx.body = err;
    }
  },

  getAllStudentsFromGroupId: async (ctx) => {
    const { id } = ctx.params;

    try {
      const groupes = await strapi.db.query("api::groupe.groupe").findOne({
        select: ["nom", "description"],
        where: { id },
        populate: {
          students: {
            select: ["id", "name_eleve"],
            where: {
              role: {
                name: "Authenticated",
              },
              confirmed: true,
            },
          },
        },
      });

      ctx.body = groupes;
    } catch (err) {
      ctx.body = err;
    }
  },
}));
