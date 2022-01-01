import {redirect} from "remix"

import type {ActionFunction, LoaderFunction} from "remix"

import {destroySession, getSession} from "~/sessions.server"

export const action: ActionFunction = async ({request}) => {
  const session = await getSession(request.headers.get(`Cookie`))
  return redirect(`/`, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  })
}

export const loader: LoaderFunction = async () => {
  throw new Response(null, {status: 404})
}
