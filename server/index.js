'use strict';

const bootstrap = require('./bootstrap');
const config = require('./config')

module.exports = {
  bootstrap,
  config,
  register: ({ strapi }) => {
    // addQueryParams was introduced in Strapi 5.37 — skip gracefully on older versions
    if (typeof strapi.contentAPI?.addQueryParams === 'function') {
      strapi.contentAPI.addQueryParams({
        pLevel: { schema: (z) => z.string().max(3).optional() },
        pIgnore: { schema: (z) => z.string().optional() },
      });
    }
  },
};