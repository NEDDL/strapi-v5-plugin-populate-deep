"use strict";
const { getFullPopulateObject } = require("./helpers");

module.exports = ({ strapi }) => {
  const defaultDepth =
    strapi
      .plugin("strapi-v5-plugin-populate-deep")
      ?.config("defaultDepth") || 5;

  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
      const { action, model, params } = event;
      // Skip if not matching db interaction
      if (!["beforeFindMany", "beforeFindOne"].includes(action)) return;
      // Skip if db query isn't targeting api::
      if (!model.uid.startsWith("api::")) return;
      // Skip if request url isn't api call
      const ctx = strapi.requestContext.get();
      if (!ctx?.request?.url?.startsWith("/api/")) return;

      const pLevel = params?.pLevel ?? ctx.query?.pLevel;
      if (pLevel === undefined) return;

      const depth = pLevel ? parseInt(pLevel, 10) : defaultDepth;
      params.populate = getFullPopulateObject(model.uid, depth, []).populate;
  });
};
