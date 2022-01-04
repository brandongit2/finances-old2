import {getSession} from "~/sessions.server"

export default async function getUserId(request: Request): Promise<string | null> {
  const session = await getSession(request.headers.get(`Cookie`))
  const userId = session.get(`userId`)
  if (typeof userId === `string`) return userId
  return null
}
