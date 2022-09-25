"use strict";
const { Service } = require("../utils/service");
const { sanitizeOutput } = require("../utils/sanitizeOutput");
const utils = require("@strapi/utils");
const { ApplicationError, ValidationError } = utils.errors;
const _ = require("lodash");
const fs = require("fs");

/**
 * A set of functions called "actions" for `experts-users`
 */

module.exports = {
  getUser: async (ctx) => {
    return Service("experts-users", "users").findOne(ctx);
  },

  getUserPayments: async (ctx) => {
    const { id } = ctx.params;
    return Service("payment", "payment").getAllPaymentForSpecificUser(ctx, id);
  },

  deactivateUser: async (ctx) => {
    const { id } = ctx.params;
    return Service("experts-users", "users").deactivateUser(ctx, id);
  },

  activateUser: async (ctx) => {
    const { id } = ctx.params;
    return Service("experts-users", "users").activateUser(ctx, id);
  },

  getAllUsers: async (ctx) => {
    return Service("experts-users", "users").findMany(ctx);
  },

  getAllUsersPayments: async (ctx) => {
    return Service("experts-users", "users").AllUsersPayments(ctx);
  },

  getAllMySubjects: async (ctx) => {
    return Service("experts-users", "users").subjects(ctx);
  },

  downloadFile: async (ctx) => {
    // todo: download file from upload directory:
    // <a class="btn btn-danger"
    //    role="button"
    //    href="http://localhost:1337/uploads/test_6cf2bd540f.pdf?updated_at=2022-02-14T18:15:35.498Z"
    //    download="fileName.pdf">
    //   Download
    // </a>

    const fileName = `${__dirname}/hello.txt`;
    ctx.body = fs.createReadStream(fileName);
    ctx.attachment(fileName);
  },

  countAllusers: async (ctx) => {
    return Service("experts-users", "users").count(ctx);
  },

  updateUser: async (ctx) => {
    const { id } = ctx.params;
    const { body } = ctx.request;

    if (!id)
      return ctx.badRequest("vous devez spécifier l'identité de l'élève");
    return Service("experts-users", "users").update(ctx, id, body);
  },

  create: async (ctx) => {
    const advanced = await strapi
      .store({ type: "plugin", name: "users-permissions", key: "advanced" })
      .get();

    const defaultRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: advanced.default_role } });

    const { body } = ctx.request;
    const { dateRange } = body;

    // remove spaces from a username
    const username = `${body.first_name_student}${body.tel}`.replace(/\s/g, "");

    // body.email_address = _.toLower(body.email_address);
    // ctx.request.body.password = body.tel;
    // ctx.request.body.username = username;
    // ctx.request.body.email = body.email_address;
    // ctx.request.body.name_parent = `${body.first_name_parents} ${body.last_name_parents}`;
    // ctx.request.body.name_eleve = `${body.first_name_student} ${body.last_name_student}`;

    // // body.password = await strapi
    // //   .service(`plugin::users-permissions.user`)
    // //   .hashPassword(body);

    const userData = {
      username: username,
      email: `${username}@kondarschool.tn`,
      password: body.tel,
      confirmed: true,
      blocked: false,
      provider: "local",
      role: defaultRole.id,
      name_parent: `${body.first_name_parents} ${body.last_name_parents}`,
      name_eleve: `${body.first_name_student} ${body.last_name_student}`,
      tel: body.tel,
      niveau: body.grade,
      grade: body.grade,
      remarque_parents: body.remarque_parents,
      remarque_center: body.remarque_center,
      subjects: " ",
      subjectsNew: body.subjectsStudent,
      pack: body.pack,
      groupe: body.group,
    };

    // return Service("experts-users", "users").create(ctx, user, dateRange);
    const user = await strapi.entityService.create(
      "plugin::users-permissions.user",
      {
        data: userData,
        populate: ["role"],
      }
    );

    if (dateRange[0] && dateRange[1]) {
      const payment = await strapi.entityService.create(
        "api::payment.payment",
        {
          data: {
            debut: dateRange[0],
            fin: dateRange[1],
            student: user.id,
            pack: user.pack,
          },
        }
      );
    }

    ctx.body = await sanitizeOutput(user, ctx);
  },

  //get all profs
  getAllProfs: async (ctx) => {
    const profs = await strapi
      .query("plugin::users-permissions.user")
      .findMany({
        select: ["id", "name_eleve", "username", "tel"],
        where: {
          role: {
            name: "prof",
          },
        },
      });
    return profs;
  },

  //create new prof
  createProf: async (ctx) => {
    const advanced = await strapi
      .store({ type: "plugin", name: "users-permissions", key: "advanced" })
      .get();

    const defaultRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { name: "prof" } });

    const { body } = ctx.request;
    const { dateRange } = body;

    // remove spaces from a username
    const username = `${body.name}${body.tel}`.replace(/\s/g, "");

    // body.email_address = _.toLower(body.email_address);
    // ctx.request.body.password = body.tel;
    // ctx.request.body.username = username;
    // ctx.request.body.email = body.email_address;
    // ctx.request.body.name_parent = `${body.first_name_parents} ${body.last_name_parents}`;
    // ctx.request.body.name_eleve = `${body.first_name_student} ${body.last_name_student}`;

    // // body.password = await strapi
    // //   .service(`plugin::users-permissions.user`)
    // //   .hashPassword(body);

    const userData = {
      username: username,
      email: `${username}@kondarschool.tn`,
      password: `kondarschool-${body.tel}`,
      confirmed: true,
      blocked: false,
      provider: "local",
      role: defaultRole.id,
      name_parent: ` `,
      name_eleve: body.name,
      tel: body.tel,
      niveau: " ",
      grade: null,
      remarque_parents: " ",
      remarque_center: " ",
      subjects: " ",
      subjectsNew: null,
      pack: null,
      groupe: null,
    };

    // return Service("experts-users", "users").create(ctx, user, dateRange);
    const user = await strapi.entityService.create(
      "plugin::users-permissions.user",
      {
        data: userData,
        populate: ["role"],
      }
    );

    ctx.body = await sanitizeOutput(user, ctx);
  },

  loginAdmin: async (ctx) => {
    const provider = "local";
    const params = ctx.request.body;
    const { identifier } = params;

    // Check if the user exists.
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      select: [
        "id",
        "username",
        "name_eleve",
        "email",
        "password",
        "blocked",
        "confirmed",
      ],
      where: {
        provider,
        $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        role: {
          name: ["admin", "prof"],
        },
      },
      populate: {
        role: {
          select: "name",
        },
      },
    });

    if (!user) {
      throw new ValidationError("Invalid identifier or password");
    }

    if (!user.password || !params.password) {
      throw new ValidationError("Invalid identifier or password");
    }

    // validate password
    const validPassword = await strapi
      .service("plugin::users-permissions.user")
      .validatePassword(params.password, user.password);

    if (!validPassword) {
      throw new ValidationError("Invalid identifier or password");
    }

    delete user.password; // remove user password

    return ctx.send({
      jwt: await strapi
        .service("plugin::users-permissions.jwt")
        .issue({ id: user.id }),
      user: user,
    });
  },

  loginUser: async (ctx) => {
    const provider = "local";
    const params = ctx.request.body;
    const { identifier } = params;

    // Check if the user exists.
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      select: [
        "id",
        "username",
        "name_eleve",
        "email",
        "password",
        "blocked",
        "confirmed",
      ],
      where: {
        provider,
        $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        role: {
          name: "Authenticated",
        },
      },
      populate: {
        role: {
          select: "name",
        },
        subjectsNew: {
          select: "name",
        },
      },
    });

    if (!user) {
      throw new ValidationError("Invalid identifier or password");
    }

    if (!user.password || !params.password) {
      throw new ValidationError("Invalid identifier or password");
    }

    // validate password
    const validPassword = await strapi
      .service("plugin::users-permissions.user")
      .validatePassword(params.password, user.password);

    if (!validPassword) {
      throw new ValidationError("Invalid identifier or password");
    }

    delete user.password; // remove user password

    return ctx.send({
      jwt: await strapi
        .service("plugin::users-permissions.jwt")
        .issue({ id: user.id }),
      user: user,
    });
  },

  getStudentsByGroupId: async (ctx) => {
    const { id } = ctx.params;
    const students = await strapi
      .query("plugin::users-permissions.user")
      .findMany({
        select: ["id", "name_eleve"],
        where: {
          groupe: { id },
        },
      });
    return ctx.send(students);
  },

  addAbsents: async (ctx) => {
    const { body } = ctx.request;

    const absent = await strapi.entityService.create("api::absent.absent", {
      data: {
        date: body.date,
        student: body.student,
        subject: body.subject,
      },
    });

    return ctx.send({ absent });
  },

  getAbsentsByStudentId: async (ctx) => {
    const {
      user: { id },
    } = ctx.state;

    const absent = await strapi.query("api::absent.absent").findMany({
      select: ["date"],
      orderBy: { id: "desc" },
      where: {
        student: { id },
      },
      populate: {
        student: {
          select: ["name_eleve"],
        },
        subject: {
          select: ["name"],
        },
      },
    });

    return ctx.send(absent);
  },

  getAbsentsByStudentIdFromAdmin: async (ctx) => {
    const { id } = ctx.params;

    const absent = await strapi.query("api::absent.absent").findMany({
      select: ["date"],
      orderBy: { id: "desc" },
      limit: 6,
      where: {
        student: { id },
      },
      populate: {
        student: {
          select: ["name_eleve"],
        },
        subject: {
          select: ["name"],
        },
      },
    });

    return ctx.send(absent);
  },

  getAbsentsByGroupeId: async (ctx) => {
    const { id } = ctx.params;

    const absent = await strapi.query("api::absent.absent").findMany({
      select: ["date"],
      orderBy: { id: "desc" },
      limit: 10,
      where: {
        student: {
          groupe: { id },
        },
      },
      populate: {
        student: {
          select: ["id", "name_eleve"],
        },
        subject: {
          select: ["name"],
        },
      },
    });

    return ctx.send(absent);
  },

  deleteProf: async (ctx) => {
    const { id } = ctx.params;

    await strapi.query("plugin::users-permissions.user").delete({
      where: { id },
    });
  },

  getProfCalenders: async (ctx) => {
    const {
      user: { id },
    } = ctx.state;

    const calender = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        select: [],
        where: { id },
        orderBy: { id: "desc" },
        limit: 1,

        populate: {
          calendries: {
            populate: {
              calendrie: {
                select: ["url"],
              },
            },
          },
        },
      });

    return calender;
  },

  getLastPayment: async (ctx) => {
    //get current user id
    const {
      user: { id },
    } = ctx.state;

    const payments = await strapi.query("api::payment.payment").findMany({
      select: ["fin"],
      orderBy: { id: "desc" },
      where: {
        student: { id },
      },
    });

    const endPaymentFilter = payments.filter(({ fin }) => fin);

    let dateNowMs = new Date().getTime();

    let finToTimestamp = endPaymentFilter.map((payment) =>
      new Date(payment.fin).getTime()
    );

    let maxDateFin = new Date(Math.max(...finToTimestamp)).getTime();

    if ((maxDateFin || 0) < dateNowMs) {
      return ctx.send("ko");
    }

    return ctx.send("ok");
  },

  // les remarque
  addRemarque: async (ctx) => {
    const { body } = ctx.request;

    const remarque = await strapi.entityService.create(
      "api::remarque.remarque",
      {
        data: {
          remarque: body.remarque,
          student: body.student,
        },
      }
    );

    return ctx.send({ remarque });
  },

  getRemarquesByStudentId: async (ctx) => {
    const {
      user: { id },
    } = ctx.state;

    const remarque = await strapi.query("api::remarque.remarque").findMany({
      select: ["remarque", "createdAt"],
      orderBy: { id: "desc" },
      where: {
        student: { id },
      },
    });

    return ctx.send(remarque);
  },

  getAttachments: async (ctx) => {
    const {
      user: { id },
    } = ctx.state;

    const user = await strapi.query("plugin::users-permissions.user").findOne({
      select: [],
      where: { id },
      populate: {
        subjectsNew: {
          select: "name",
        },
        grade: {
          select: "name",
        },
      },
    });

    const entries = await strapi.db
      .query("api::attachment.attachment")
      .findMany({
        orderBy: { id: "desc" },
        where: {
          subject: {
            name: {
              $in: user.subjectsNew.map((subject) => subject.name),
            },
          },
          grade: {
            name: user.grade.name,
          },
        },
        populate: {
          grade: {
            select: "name",
          },
          subject: {
            select: "name",
          },
          files: {
            select: ["name", "url"],
          },
        },
      });

    return ctx.send({ attachments: entries, cours: user.subjectsNew });
  },
};
