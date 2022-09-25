module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "a0b7793cab208d76b1eade88a3dd8b34"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  serveAdminPanel: env.bool("SERVER_ADMIN_PANEL", false),
});
