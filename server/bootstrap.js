"use strict";
const { getFullPopulateObject } = require("./helpers");

module.exports = ({ strapi }) => {
  const defaultDepth =
    strapi.plugin("strapi-v5-plugin-populate-deep")?.config("defaultDepth") ||
    5;

  strapi.db.lifecycles.subscribe((event) => {
    const { action, model, params } = event;

    if (!["beforeFindMany", "beforeFindOne"].includes(action)) return;
    if (!model.uid.startsWith("api::")) return;

    const ctx = strapi.requestContext.get();
    if (!ctx?.request?.url?.startsWith("/api/")) return;

    const pLevel = params?.pLevel ?? ctx.query?.pLevel;
    if (pLevel === undefined) return;

    const pIgnore = params?.pIgnore ?? ctx.query?.pIgnore ?? [];
    const ignore = typeof pIgnore === 'string' ? pIgnore.split(',').map(s => s.trim()) : Array.isArray(pIgnore) ? pIgnore : [pIgnore];

    const depth = pLevel ? parseInt(pLevel, 10) : defaultDepth;
    const populateObj = getFullPopulateObject(model.uid, depth, ignore);
    if (populateObj) params.populate = populateObj;
  });
};
