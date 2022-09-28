module.exports = {
  apps: [
    {
      name: "api-kondarschool",
      script: "yarn",
      args: "start-prod",
      env: {
        NODE_ENV: "production",
      },
      exp_backoff_restart_delay: 100,
    },
  ],
};
