import {redirect} from "remix"

import type {FC} from "react"
import type {LoaderFunction} from "remix"

import Header from "~/components/Header"
import {getSession} from "~/sessions.server"

export const loader: LoaderFunction = async ({request}) => {
  const session = await getSession(request.headers.get(`Cookie`))
  if (!session.has(`userId`)) return redirect(`/`)
  return null
}

const Dashboard: FC = () => {
  return (
    <div>
      <Header />
      dashboard
    </div>
  )
}

export default Dashboard
