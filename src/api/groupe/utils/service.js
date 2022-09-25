const Service = (api, name) => {
  return strapi.service(`api::${api}.${name}`);
};

module.exports = {
  Service,
};
