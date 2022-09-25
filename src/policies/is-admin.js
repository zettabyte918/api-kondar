module.exports = (policyContext, config, { strapi }) => {
  // if (policyContext.state.user?.role.name === "admin") {
  //   // if a session is open
  //   // go to next policy or reach the controller's action
  //   return true;
  // }
  return true;

  // return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
