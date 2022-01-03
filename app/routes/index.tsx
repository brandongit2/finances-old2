import {redirect} from "remix"

import type {FC} from "react"
import type {ActionFunction, LoaderFunction} from "remix"
import type {TSignIn} from "~/features/sign-in/SignInForm"
import type {ValidationErrorObj} from "~/util/validation"

import A from "~/components/atoms/A"
import Card from "~/components/atoms/Card"
import Hr from "~/components/atoms/Hr"
import Logo from "~/components/Logo"
import SignInForm, {signInSchema} from "~/features/sign-in/SignInForm"
import {commitSession, getSession} from "~/sessions.server"
import authorize, {UserType} from "~/util/authorize.server"
import {compare} from "~/util/bcrypt.server"
import {db} from "~/util/prisma.server"
import {validate, ValidationError} from "~/util/validation"

export const loader: LoaderFunction = async ({request}) => {
  const authorized = await authorize(request, [UserType.UNAUTHENTICATED])
  if (!authorized) return redirect(`/dashboard`)
  return null
}

export const action: ActionFunction = async ({request}): Promise<ValidationErrorObj<any> | Response> => {
  let credentials: TSignIn
  try {
    credentials = await validate<TSignIn>(request, signInSchema)
  } catch (err) {
    if (!(err instanceof ValidationError)) throw err
    return err.errorObj
  }

  const user = await db.user.findUnique({where: {email: credentials.email}})
  if (!user || !compare(credentials.password, user.passwordHash)) return {root: [`Invalid email-password combination.`]}

  const session = await getSession(request.headers.get(`Cookie`))
  session.set(`userId`, user.id)

  return redirect(`/dashboard`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}

const Index: FC = () => {
  return (
    <div className="h-full grid place-items-center">
      <div className="h-full mx-4 my-12 flex flex-col justify-center items-stretch gap-6">
        <Logo className="w-60 mx-auto mb-4" />

        <div className="shadow-[0px_0px_20px_0px_var(--olive-5)]">
          <SignInForm />
        </div>

        <Hr text="OR" />

        <div className="shadow-[0px_0px_20px_0px_var(--olive-5)]">
          <Card className="force-light">
            <p className="text-center">
              <A>Enter demo mode</A>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Index
