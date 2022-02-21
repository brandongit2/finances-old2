import {redirect, useSubmit} from "remix"

import type {FC} from "react"
import type {LoaderFunction} from "remix"

import Card from "~/components/atoms/Card"
import Hr from "~/components/atoms/Hr"
import Logo from "~/components/Logo"
import SignInForm from "~/features/sign-in/SignInForm"
import authorize, {UserType} from "~/util/authorize.server"

export const loader: LoaderFunction = async ({request}) => {
  const authorized = await authorize(request, [UserType.UNAUTHENTICATED])
  if (!authorized) return redirect(`/dashboard`)
  return null
}

const Index: FC = () => {
  const submit = useSubmit()

  const enterDemoMode = () => {
    submit(
      {
        email: `demo@finances.brandontsang.net`,
        password: `password`,
      },
      {
        method: `post`,
        action: `/sign-in`,
        replace: true,
      },
    )
  }

  return (
    <div className="h-full flex flex-col items-center">
      <div className="h-full mx-4 my-12 flex flex-col justify-center items-stretch gap-6">
        <Logo className="w-60 mx-auto mb-4" />

        <div className="shadow-[0px_0px_20px_0px_var(--olive-5)]">
          <SignInForm />
        </div>

        <Hr text="OR" />

        <div className="shadow-[0px_0px_20px_0px_var(--olive-5)]">
          <Card className="force-light max-w-md flex flex-col gap-4">
            <button
              onClick={() => void enterDemoMode()}
              className="mx-auto text-lg font-semibold text-grass-11 underline"
            >
              Enter demo mode
            </button>
            <p className="text-sm text-olive-11">
              Demo mode is the same as the full app, only that it uses premade dummy data, and changes are not committed
              to the database. Perfect for if you just want a glimpse at the app!
            </p>
          </Card>
        </div>
      </div>
      <p className="m-2 text-olive-11">
        Made by{` `}
        <a href="https://brandontsang.net" target="_blank" rel="noreferrer" className="underline">
          Brandon Tsang
        </a>
        .
      </p>
    </div>
  )
}

export default Index
