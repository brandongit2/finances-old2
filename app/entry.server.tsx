import "core-js/features/array/at" // For Node 14 (on Netlify)
import "core-js/proposals/string-replace-all" // For Node 14 (on Netlify)
import {renderToString} from "react-dom/server"
import {RemixServer} from "remix"

import type {EntryContext} from "remix"

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />)

  responseHeaders.set(`Content-Type`, `text/html`)

  return new Response(`<!DOCTYPE html>` + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
