// From https://github.com/remix-run/remix/blob/main/packages/create-remix/templates/netlify/netlify/functions/server/index.js

const {createRequestHandler} = require(`@remix-run/netlify`)
const path = require(`path`)

const BUILD_DIR = path.join(process.cwd(), `netlify`)

function purgeRequireCache() {
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}

exports.handler =
  process.env.NODE_ENV === `production`
    ? createRequestHandler({build: require(`./build`)})
    : (event, context) => {
        purgeRequireCache()
        return createRequestHandler({build: require(`./build`)})(event, context)
      }
