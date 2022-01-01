import {Outlet, redirect} from "remix"

import type {FC} from "react"
import type {LoaderFunction, ActionFunction} from "remix"

import Header from "~/components/Header"
import Transactions from "~/features/transactions/Transactions"
import {getSession} from "~/sessions.server"
import {db} from "~/util/prisma.server"

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData()
}

export const loader: LoaderFunction = async ({request}) => {
  const session = await getSession(request.headers.get(`Cookie`))
  if (!session.has(`userId`)) return redirect(`/`)

  const transactions = await db.transaction.findMany({})
  return transactions
}

const DashboardLayout: FC = () => {
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <Header />
      <div
        className="p-6 pt-2 grid grid-rows-[1fr] grid-cols-[20rem_30rem_1fr] gap-4"
        style={{gridTemplateAreas: `"transactions transaction-preview ."`}}
      >
        <div className="[grid-area:transactions] grid place-items-stretch">
          <Transactions />
        </div>
        <div className="[grid-area:transaction-preview] grid place-items-stretch">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
