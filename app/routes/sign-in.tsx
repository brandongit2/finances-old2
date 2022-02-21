import {redirect} from "remix"

import type {ActionFunction, LoaderFunction} from "remix"
import type {TSignIn} from "~/features/sign-in/SignInForm"

import {signInSchema} from "~/features/sign-in/SignInForm"
import {commitSession, getSession} from "~/sessions.server"
import authorize, {UserType} from "~/util/authorize.server"
import {compare} from "~/util/bcrypt.server"
import {db} from "~/util/prisma.server"
import {validate, ValidationError} from "~/util/validation"

export const action: ActionFunction = async ({request}) => {
  const authorized = await authorize(request, [UserType.UNAUTHENTICATED])
  if (!authorized) return redirect(`/dashboard`)

  console.log(`signing in`)
  switch (request.method) {
    case `POST`: {
      let credentials: TSignIn
      try {
        credentials = await validate<TSignIn>(request, signInSchema)
      } catch (err) {
        if (!(err instanceof ValidationError)) throw err
        return err.errorObj
      }

      console.log(`validation passed`)
      const user = await db.user.findUnique({where: {email: credentials.email}})
      if (!user || !compare(credentials.password, user.passwordHash))
        return {root: [`Invalid email-password combination.`]}
      console.log(`credentials valid`)

      const session = await getSession(request.headers.get(`Cookie`))
      session.set(`userId`, user.id)

      console.log(`redirecting`)
      return redirect(`/dashboard`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      })
    }
    default: {
      throw new Response(undefined, {status: 405})
    }
  }
}

export const loader: LoaderFunction = async () => {
  throw new Response(undefined, {status: 404})
}
