import {redirect} from "remix"

import type {FC} from "react"
import type {ActionFunction} from "remix"

import A from "~/components/atoms/A"
import Card from "~/components/atoms/Card"
import Hr from "~/components/atoms/Hr"
import type {TSignIn} from "~/features/sign-in/SignInForm"
import SignInForm, {signInSchema} from "~/features/sign-in/SignInForm"
import type {ValidationErrorObj} from "~/util/validation"
import {validate, ValidationError} from "~/util/validation"

export const action: ActionFunction = async ({request}): Promise<ValidationErrorObj<any> | Response> => {
  try {
    await validate<TSignIn>(request, signInSchema)
    return redirect(`/dashboard`)
  } catch (err) {
    if (!(err instanceof ValidationError)) throw err
    return err.errorObj
  }
}

const Index: FC = () => {
  return (
    <div className="h-full grid place-items-center">
      <div className="h-full flex flex-col justify-center items-stretch gap-6">
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
