import {redirect} from "remix"

import type {FC} from "react"
import type {LoaderFunction} from "remix"

import A from "~/components/atoms/A"
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
