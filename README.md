# Strapi v5 Plugin: populate-deep

This plugin is a fork of the original [strapi-plugin-populate-deep](https://github.com/Barelydead/strapi-plugin-populate-deep), which does not support Strapi v5 at the time of this publication.

## Why this Fork?

With Strapi v5, a new [API structure validation feature](https://github.com/strapi/strapi/pull/21034) was introduced, which makes the populate parameter incompatible with how the original plugin works. This plugin addresses that by introducing a new parameter pLevel to avoid validation issues.

# Installation

`npm install strapi-v5-plugin-populate-deep`

`yarn add strapi-v5-plugin-populate-deep`

Also, the npm link is [here](https://www.npmjs.com/package/strapi-v5-plugin-populate-deep).

# Usages

The plugin allows you to deeply populate data in your Strapi queries with a new parameter pLevel. This parameter specifies the depth of population for your API responses.

## Examples

1. Populate a request with the default max depth.
   `/api/articles?pLevel`

2. Populate a request with the a custom depth
   `/api/articles?pLevel=10`

3. Ignore some fields
```js
strapi.documents(model).findMany({
  pLevel: 10,
  pIgnore: ['updatedBy', 'createdBy', 'permissions', 'role', 'users'],
});
```


## Good to know

- The default maximum depth is 5 levels deep.
- The pLevel parameter works for all collections and single types when using findOne and findMany methods.
- Increasing the depth level may result in longer API response times.

# Configuration

You can configure the default depth globally through the plugin configuration.

## Example configuration

To customize the default depth, add or modify the config/plugins.js file as shown below:
`config/plugins.js`

```
module.exports = ({ env }) => ({
  'strapi-v5-plugin-populate-deep': {
    config: {
      defaultDepth: 3, // Default is 5
    }
  },
});
```

This configuration will set the default depth to 3 levels across all API requests unless specified otherwise in the request itself.

# Contributions

This plugin is a fork of the original work by [Barelydead](https://github.com/Barelydead/) and can be found in the original [repository](https://github.com/Barelydead/strapi-plugin-populate-deep).

The original idea for getting the populate structure was created by [tomnovotny7](https://github.com/tomnovotny7) and can be found in [this](https://github.com/strapi/strapi/issues/11836) github thread

Thank you to [tooonuch](https://github.com/tooonuch) for fixing the dynamic zone population issue. He resolved a problem where components with the same attribute name were not populated correctly by using the `on` property. This improvement helps ensure proper population for all components.

We appreciate and acknowledge all contributions made by the open-source community to the original project.
