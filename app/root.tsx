import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from "remix"

import type {MetaFunction} from "remix"

import colorStyles from "./colors.css"
import globalStyles from "./global.css"
import tailwindStyles from "./tailwind.css"

export function links() {
  return [
    {rel: `stylesheet`, href: colorStyles},
    {rel: `stylesheet`, href: globalStyles},
    {rel: `stylesheet`, href: tailwindStyles},
    {rel: `icon`, href: `/favicon.svg`},
    {rel: `alternate icon`, href: `/favicon.png`},
    {rel: `mask-icon`, href: `/favicon.svg`, color: `#46a758`},
  ]
}

export const meta: MetaFunction = () => {
  return {title: `Finances`}
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === `development` && <LiveReload />}
      </body>
    </html>
  )
}
