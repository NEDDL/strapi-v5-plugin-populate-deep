"use strict";
const { getFullPopulateObject } = require("./helpers");

module.exports = ({ strapi }) => {
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === "beforeFindMany" || event.action === "beforeFindOne") {
      const level = event.params?.pLevel;
      const ignore =  event.params?.pIgnore || [];

      const defaultDepth =
        strapi
          .plugin("strapi-v5-plugin-populate-deep")
          ?.config("defaultDepth") || 5;

      if (level !== undefined) {
        const depth = level ?? defaultDepth;
        const modelObject = getFullPopulateObject(event.model.uid, depth, ignore);
        event.params.populate = modelObject.populate;
      }
    }
  });
};
