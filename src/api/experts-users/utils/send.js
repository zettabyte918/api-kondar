const { sanitizeOutput } = require("./sanitizeOutput");

const send = async (ctx, entries) => {
  if (!entries) return ctx.notFound("étudiant introuvable");
  const sanitizedData = await sanitizeOutput(entries, ctx);
  ctx.body = sanitizedData;
};

module.exports = {
  send,
};
