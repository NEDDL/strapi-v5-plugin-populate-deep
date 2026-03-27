const isEmpty = (obj) => Object.keys(obj).length === 0;

const deepAssign = (target, source) => {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === "object" && source[key] !== null) {
        if (
          !target[key] ||
          typeof target[key] !== "object" ||
          target[key] === null
        ) {
          target[key] = source[key];
        }
        deepAssign(target[key], source[key]);
      } else if (
        !target[key] ||
        typeof target[key] !== "object" ||
        target[key] === null
      ) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

const getModelPopulationAttributes = (model) => {
  if (model.uid === "plugin::upload.file") {
    const { related, ...attributes } = model.attributes;
    return attributes;
  }

  return model.attributes;
};

const getFullPopulateObject = (modelUid, maxDepth = 20, ignore) => {
  if (maxDepth <= 1) {
    return true;
  }

  if (modelUid === "admin::user" && strapi
    .plugin("strapi-v5-plugin-populate-deep")
    ?.config("skipCreatorFields")) {
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
        populate[key] = getFullPopulateObject(value.component, maxDepth - 1, [...ignore]);
      } else if (value.type === "dynamiczone") {
        const dynamicPopulate = value.components.reduce((prev, cur) => {
          const curPopulate = getFullPopulateObject(cur, maxDepth - 1, [...ignore]);
          return curPopulate === undefined ? prev : deepAssign(prev, { [cur]: curPopulate });
        }, {});
        populate[key] = isEmpty(dynamicPopulate) ? true : { on: dynamicPopulate };
      } else if (value.type === "relation") {
        if (ignore?.includes(strapi.getModel(value.target).collectionName)) continue;
        const relationPopulate = getFullPopulateObject(
          value.target,
          key === "localizations" && maxDepth > 2 ? 1 : maxDepth - 1,
          [...ignore]
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
