export default {
  env: process.env.NODE_ENV,
  production: {
    serverBaseUrl: 'https://api.lawkd.com',
  },
  development: {
    serverBaseUrl: 'https://devapi.lawkd.com',
  }
};
