"use strict";

/**
 *  pack controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::pack.pack", ({ strapi }) => ({
  async find(ctx) {
    // get all packs
    const entries = await strapi.db.query("api::pack.pack").findMany({
      select: ["id", "nom", "description"],
    });

    if (!entries)
      throw new ValidationError("Il n'y a pas de packs disponibles");

    return entries;
  },
}));
