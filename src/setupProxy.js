const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/countries',
    createProxyMiddleware({
      target: 'https://api.restcountries.com',
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Authorization', 'Bearer rc_live_473794fd12414cdfa51391fa7bd49d27');
      },
    })
  );
};
