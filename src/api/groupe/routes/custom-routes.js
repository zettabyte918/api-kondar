module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/groupes",
      handler: "groupe.getAllGroupes",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/groupes/student/:id",
      handler: "groupe.getAllStudentsFromGroupId",
      config: {
        policies: ["global::is-admin"],
        middlewares: [],
      },
    },
  ],
};
