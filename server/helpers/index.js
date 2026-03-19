const { isEmpty, mergeWith } = require("lodash/fp");

const isObj = (val) => typeof val === "object" && val !== null;

const deepAssign = (target, source) => {
  return mergeWith(target, source, (objValue, srcValue) => {
    // If existing target is an object/array, but incoming source is a primitive: Return existing object
    if (isObj(objValue) && !isObj(srcValue)) return objValue;
  });
};

const getModelPopulationAttributes = (model) => {
  if (model.uid === "plugin::upload.file") {
    const { related, ...attributes } = model.attributes;
    return attributes;
  }

  return model.attributes;
};

const getFullPopulateObject = (modelUid, maxDepth = 20, ignore) => {
  const skipCreatorFields = strapi
    .plugin("strapi-v5-plugin-populate-deep")
    ?.config("skipCreatorFields");

  if (maxDepth <= 1) {
    return true;
  }
  if (modelUid === "admin::user" && skipCreatorFields) {
    return undefined;
  }

  const populate = {};
  const model = strapi.getModel(modelUid);
  if (ignore && !ignore.includes(model.collectionName))
    ignore.push(model.collectionName);
  for (const [key, value] of Object.entries(
    getModelPopulationAttributes(model)
  )) {
    if (ignore?.includes(key) || value.private === true) continue;
    if (value) {
      if (value.type === "component") {
        populate[key] = getFullPopulateObject(value.component, maxDepth - 1, ignore);
      } else if (value.type === "dynamiczone") {
        const dynamicPopulate = value.components.reduce((prev, cur) => {
          return deepAssign(prev, { [cur]: getFullPopulateObject(cur, maxDepth - 1) });
        }, {});
        populate[key] = isEmpty(dynamicPopulate) ? true : { on: dynamicPopulate };
      } else if (value.type === "relation") {
        if (ignore?.includes(strapi.getModel(value.target).collectionName)) continue;
        const relationPopulate = getFullPopulateObject(
          value.target,
          key === "localizations" && maxDepth > 2 ? 1 : maxDepth - 1,
          ignore
        );
        if (relationPopulate) {
          populate[key] = relationPopulate;
        }
      } else if (value.type === "media") {
        populate[key] = true;
      }
    }
  }
  return isEmpty(populate) ? true : { populate };
};

module.exports = {
  getFullPopulateObject,
};
