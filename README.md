# strapi-v5-plugin-populate-deep

A Strapi v5 plugin that enables deep population of nested content structures via a simple query parameter.

[![npm version](https://img.shields.io/npm/v/strapi-v5-plugin-populate-deep?label=version&color=blue)](https://www.npmjs.com/package/strapi-v5-plugin-populate-deep)
[![npm downloads](https://img.shields.io/npm/dm/strapi-v5-plugin-populate-deep?color=brightgreen)](https://www.npmjs.com/package/strapi-v5-plugin-populate-deep)
[![npm total downloads](https://img.shields.io/npm/dt/strapi-v5-plugin-populate-deep)](https://www.npmjs.com/package/strapi-v5-plugin-populate-deep)
[![license](https://img.shields.io/npm/l/strapi-v5-plugin-populate-deep)](./LICENSE)
[![node](https://img.shields.io/node/v/strapi-v5-plugin-populate-deep)](https://www.npmjs.com/package/strapi-v5-plugin-populate-deep)
[![install size](https://packagephobia.com/badge?p=strapi-v5-plugin-populate-deep)](https://packagephobia.com/result?p=strapi-v5-plugin-populate-deep)
[![GitHub stars](https://img.shields.io/github/stars/NEDDL/strapi-v5-plugin-populate-deep?style=social)](https://github.com/NEDDL/strapi-v5-plugin-populate-deep/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/NEDDL/strapi-v5-plugin-populate-deep?style=social)](https://github.com/NEDDL/strapi-v5-plugin-populate-deep/network/members)
[![GitHub issues](https://img.shields.io/github/issues/NEDDL/strapi-v5-plugin-populate-deep)](https://github.com/NEDDL/strapi-v5-plugin-populate-deep/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/NEDDL/strapi-v5-plugin-populate-deep)](https://github.com/NEDDL/strapi-v5-plugin-populate-deep/commits/main)
[![GitHub contributors](https://img.shields.io/github/contributors/NEDDL/strapi-v5-plugin-populate-deep)](https://github.com/NEDDL/strapi-v5-plugin-populate-deep/graphs/contributors)
[![Strapi v5](https://img.shields.io/badge/Strapi-v5-8C4BFF?logo=strapi)](https://strapi.io)

## Installation

```bash
npm install strapi-v5-plugin-populate-deep
# or
yarn add strapi-v5-plugin-populate-deep
```

## Usage

Add `pLevel` to any API request to deeply populate the response.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pLevel` | `number` (optional) | Depth of population. Omit the value to use the default depth. |
| `pIgnore` | `string` or `string[]` (optional) | Fields or collection names to exclude from population. Accepts a comma-separated string or array. |

### Examples

```
# Use default depth (5)
GET /api/articles?pLevel

# Use custom depth
GET /api/articles?pLevel=10

# Ignore specific fields (comma-separated string)
GET /api/articles?pLevel=5&pIgnore=author,tags

# Ignore specific fields (array syntax)
GET /api/articles?pLevel=5&pIgnore[0]=author&pIgnore[1]=tags
```

## Configuration

Customize the default depth globally via `config/plugins.js` (or `.ts`):

```js
// config/plugins.js
module.exports = ({ env }) => ({
  'strapi-v5-plugin-populate-deep': {
    config: {
      defaultDepth: 3, // default: 5
    },
  },
});
```

## Good to Know

- Default depth is **5** unless configured otherwise.
- Works for all collections and single types (`findOne` and `findMany`).
- `pIgnore` prevents circular population and can significantly reduce response size and query time.
- Increasing depth may result in longer response times — use `pIgnore` to offset this.
- `plugin::upload.file` related field is always excluded to avoid bloated responses.
- `admin::user` (creator fields) can be excluded via `skipCreatorFields` config:

```js
module.exports = ({ env }) => ({
  'strapi-v5-plugin-populate-deep': {
    config: {
      defaultDepth: 5,
      skipCreatorFields: true,
    },
  },
});
```

## Contributors

<a href="https://github.com/NEDDL/strapi-v5-plugin-populate-deep/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=NEDDL/strapi-v5-plugin-populate-deep" />
</a>

Based on the original work by [Barelydead](https://github.com/Barelydead/strapi-plugin-populate-deep). Original populate concept by [tomnovotny7](https://github.com/tomnovotny7) ([thread](https://github.com/strapi/strapi/issues/11836)). Dynamic zone fix by [tooonuch](https://github.com/tooonuch).
