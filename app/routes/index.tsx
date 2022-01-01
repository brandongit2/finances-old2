import {redirect} from "remix"

import type {FC} from "react"
import type {ActionFunction, LoaderFunction} from "remix"

import A from "~/components/atoms/A"
import Card from "~/components/atoms/Card"
import Hr from "~/components/atoms/Hr"
import type {TSignIn} from "~/features/sign-in/SignInForm"
import SignInForm, {signInSchema} from "~/features/sign-in/SignInForm"
import {commitSession, getSession} from "~/sessions.server"
import {compare} from "~/util/bcrypt.server"
import client from "~/util/prisma.server"
import type {ValidationErrorObj} from "~/util/validation"
import {validate, ValidationError} from "~/util/validation"

export const loader: LoaderFunction = async ({request}) => {
  const session = await getSession(request.headers.get(`Cookie`))
  if (session.has(`userId`)) return redirect(`/dashboard`)
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

  const user = await client.user.findUnique({where: {email: credentials.email}})
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
      <div className="h-full flex flex-col justify-center items-stretch gap-6">
        <img src="/logo.svg" className="w-60 mx-auto mb-4" />
        <SignInForm />
        <Hr text="OR" />
        <Card>
          <p className="text-center">
            <A>Enter demo mode</A>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default Index
