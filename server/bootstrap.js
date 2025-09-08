"use strict";
const { getFullPopulateObject } = require("./helpers");

module.exports = ({ strapi }) => {
  const defaultDepth =
    strapi.plugin("strapi-v5-plugin-populate-deep")?.config("defaultDepth") ||
    5;
  const defaultIncludeDuplicates =
    strapi.plugin("strapi-v5-plugin-populate-deep")?.config("includeDuplicates") ||
    false;

  strapi.db.lifecycles.subscribe((event) => {
    const { action, model, params } = event;

    if (!["beforeFindMany", "beforeFindOne"].includes(action)) return;
    if (!model.uid.startsWith("api::")) return;

<<<<<<< HEAD
    const ctx = strapi.requestContext.get();
    if (!ctx?.request?.url?.startsWith("/api/")) return;

    const pLevel = params?.pLevel ?? ctx.query?.pLevel;
    if (pLevel === undefined) return;

    const pIgnore = params?.pIgnore ?? ctx.query?.pIgnore ?? [];
    const ignore = typeof pIgnore === 'string' ? pIgnore.split(',').map(s => s.trim()) : Array.isArray(pIgnore) ? pIgnore : [pIgnore];
    const includeDuplicates = params?.includeDuplicates ?? defaultIncludeDuplicates;

    const depth = pLevel ? parseInt(pLevel, 10) : defaultDepth;
    const populateObj = getFullPopulateObject(model.uid, depth, ignore, includeDuplicates);
    if (populateObj && populateObj !== true) {
      params.populate = populateObj.populate;
||||||| parent of 1a11dbf (Include duplicates in response)
      if (level !== undefined) {
        const depth = level ?? defaultDepth;
        const modelObject = getFullPopulateObject(event.model.uid, depth, []);
        event.params.populate = modelObject.populate;
      }
=======
      const defaultIncludeDuplicates =
        strapi
          .plugin("strapi-v5-plugin-populate-deep")
          ?.config("includeDuplicates") || false;

      if (level !== undefined) {
        const depth = level ?? defaultDepth;
        const includeDuplicates =
          includeDuplicatesParam !== undefined
            ? includeDuplicatesParam !== "false"
            : defaultIncludeDuplicates;
        const modelObject = getFullPopulateObject(event.model.uid, depth, [], includeDuplicates);
        event.params.populate = modelObject.populate;
      }
>>>>>>> 1a11dbf (Include duplicates in response)
    }
  });
};
