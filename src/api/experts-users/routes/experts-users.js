module.exports = {
  routes: [
    {
      method: "GET",
      path: "/experts-users/payments/:id",
      handler: "experts-users.getUserPayments",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/experts-users/payments",
      handler: "experts-users.getAllUsersPayments",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/experts-users/count",
      handler: "experts-users.countAllusers",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/experts-users/:id",
      handler: "experts-users.getUser",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/experts-users/deactivate/:id",
      handler: "experts-users.deactivateUser",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/experts-users/activate/:id",
      handler: "experts-users.activateUser",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/experts-users",
      handler: "experts-users.getAllUsers",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/attachments",
      handler: "experts-users.getAttachments",
      config: {
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/user/absents",
      handler: "experts-users.addAbsents",
      config: {
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/users/absents/groupe/:id",
      handler: "experts-users.getAbsentsByGroupeId",
      config: {
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/users/groupe/:id",
      handler: "experts-users.getStudentsByGroupId",
      config: {
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/absents/me",
      handler: "experts-users.getAbsentsByStudentId",
      config: {
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/calenders/me",
      handler: "experts-users.getProfCalenders",
      config: {
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/absents/:id",
      handler: "experts-users.getAbsentsByStudentIdFromAdmin",
      config: {
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/user/remarques",
      handler: "experts-users.addRemarque",
      config: {
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/remarques/me",
      handler: "experts-users.getRemarquesByStudentId",
      config: {
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/last-payment",
      handler: "experts-users.getLastPayment",
      config: {
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/experts-users/prof/profs",
      handler: "experts-users.getAllProfs",
      config: {
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/experts-users/create-prof",
      handler: "experts-users.createProf",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/experts-users/:id",
      handler: "experts-users.updateUser",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/experts-users",
      handler: "experts-users.create",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/experts-users/admin",
      handler: "experts-users.loginAdmin",
      config: {
        middlewares: ["plugin::users-permissions.rateLimit"],
        prefix: "",
      },
    },
    {
      method: "POST",
      path: "/experts-users/user",
      handler: "experts-users.loginUser",
      config: {
        middlewares: ["plugin::users-permissions.rateLimit"],
        prefix: "",
      },
    },
  ],
};
