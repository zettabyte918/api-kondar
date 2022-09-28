module.exports = [
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      origin: [
        "http://localhost:1337",
        "https://api.kondarschool.tn",
        "http://localhost:3100",
        "https://admin.kondarschool.tn",
        "http://localhost:3101",
        "https://kondarschool.tn",
      ],
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  {
    name: "strapi::public",
    config: {
      defaultIndex: false,
    },
  },
];
