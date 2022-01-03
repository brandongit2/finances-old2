import {Outlet, redirect} from "remix"

import type {FC} from "react"
import type {LoaderFunction} from "remix"

import Header from "~/components/Header"
import Transactions from "~/features/transactions/Transactions"
import authorize, {UserType} from "~/util/authorize.server"
import {db} from "~/util/prisma.server"

export const loader: LoaderFunction = async ({request}) => {
  const authorized = await authorize(request, [UserType.AUTHENTICATED])
  if (!authorized) return redirect(`/`)

  const transactions = await db.transaction.findMany({orderBy: {createdAt: `desc`}})
  return transactions
}

const DashboardLayout: FC = () => {
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <Header />
      <div
        className="h-full p-6 pt-2 grid grid-rows-[1fr] grid-cols-[30rem_1fr] gap-4"
        style={{gridTemplateAreas: `"transactions ."`}}
      >
        <div className="h-full [grid-area:transactions] relative flex flex-col items-stretch children:flex-[1_1_0px]">
          <Transactions />
        </div>
        <div className="h-full grid place-items-stretch">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
