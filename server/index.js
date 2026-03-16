'use strict';

const bootstrap = require('./bootstrap');
const config = require('./config')

module.exports = {
  bootstrap,
  config,
  register: ({ strapi }) => {
    strapi.contentAPI.addQueryParams({
      pLevel: { schema: (z) => z.string().max(3).optional() },
      pIgnore: { schema: (z) => z.union([z.string(), z.array(z.string())]).optional() },
    });
  },
};