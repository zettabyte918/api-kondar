"use strict";
const { sanitizeOutput } = require("../utils/sanitizeOutput");

/**
 * experts-users service.
 */

module.exports = () => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id },
        populate: true,
      });

    if (!entry) return ctx.notFound("élève introuvable");
    return await sanitizeOutput(entry, ctx);
  },

  async findMany(ctx) {
    const entries = await strapi.db
      .query("plugin::users-permissions.user")
      .findMany({
        select: ["name_eleve", "email", "niveau", "confirmed", "tel"],
        where: {
          $and: [
            {
              role: {
                name: "Authenticated",
              },
            },
            { confirmed: true },
          ],
        },
        populate: {
          pack: true,
          groupe: true,
          grade: true,
        },
      });

    if (!entries) return ctx.notFound("il n'y a pas d'élèves");
    ctx.body = entries;
  },

  async AllUsersPayments(ctx) {
    const entries = await strapi.db
      .query("plugin::users-permissions.user")
      .findMany({
        select: ["name_eleve", "email", "niveau", "confirmed", "tel"],
        where: {
          $and: [
            {
              role: {
                name: "Authenticated",
              },
              pack: {
                id: {
                  $ne: 1,
                },
              },
            },
            { confirmed: true },
          ],
        },
        populate: {
          payments: {
            select: ["id", "debut", "fin"],
            orderBy: "id",
          },
        },
      });

    if (!entries) return ctx.notFound("il n'y a pas d'élèves");
    ctx.body = entries;
  },

  async deactivateUser(ctx, id) {
    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .update({
        where: { id },
        data: {
          confirmed: false,
          groupe: null,
          pack: null,
        },
      });
    if (!entry) return ctx.notFound("il n'y a pas d'élèves");
    ctx.body = "success";
  },

  async activateUser(ctx, id) {
    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .update({
        where: { id },
        data: {
          confirmed: true,
        },
      });
    if (!entry) return ctx.notFound("il n'y a pas d'élèves");
    ctx.body = "success";
  },

  async count(ctx) {
    const count = await strapi.db
      .query("plugin::users-permissions.user")
      .count({
        where: {
          $and: [
            {
              role: {
                name: "Authenticated",
              },
            },
            {
              confirmed: true,
            },
          ],
        },
      });
    return count;
  },

  async subjects(ctx) {
    return ctx.state.user;
  },

  async update(ctx, id, user) {
    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .update({
        where: { id },
        data: {
          ...user,
          subjectsNew: user.subjectsStudent,
        },
      });
    if (!entry) return ctx.notFound("il n'y a pas d'élèves");
    ctx.body = await sanitizeOutput(entry, ctx);
  },

  // we don't need this function we already create the user in the controller
  async create(ctx, user, dateRange) {
    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .create({
        data: {
          ...user,
        },
      });
    if (!entry) return ctx.notFound("il n'y a pas d'élèves");

    if (dateRange[0] && dateRange[0]) {
      const payment = await strapi.entityService.create(
        "api::payment.payment",
        {
          data: {
            debut: dateRange[0],
            fin: dateRange[1],
            student: entry.id,
            pack: user.pack,
          },
        }
      );

      console.log(`student: ${entry.id} pack: ${user.pack}`);
    }

    ctx.body = await sanitizeOutput(entry, ctx);
  },
});
