import {getSession} from "~/sessions.server"
import {db} from "~/util/prisma.server"

export enum UserType {
  UNAUTHENTICATED,
  AUTHENTICATED,
}

export default async function authorize(request: Request, userTypes: UserType[]): Promise<boolean> {
  const isSignedIn = await (async () => {
    const session = await getSession(request.headers.get(`Cookie`))
    if (!session.has(`userId`)) return false

    const userId = session.get(`userId`)
    const user = await db.user.findUnique({where: {id: userId}})
    if (!user) return false
    return true
  })()

  let willAllow = false
  if (userTypes.includes(UserType.UNAUTHENTICATED) && !isSignedIn) willAllow = true
  if (userTypes.includes(UserType.AUTHENTICATED) && isSignedIn) willAllow = true

  return willAllow
}
