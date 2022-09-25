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
        "https://api.les-experts.tn",
        "http://localhost:3000",
        "https://admin.les-experts.tn",
        "http://localhost:3001",
        "https://les-experts.tn",
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
