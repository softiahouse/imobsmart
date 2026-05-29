module.exports = {
  apps: [
    {
      name: 'nk-website',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/nkestetica',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
