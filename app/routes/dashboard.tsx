import {redirect} from "remix"

import type {FC} from "react"
import type {LoaderFunction} from "remix"

import Header from "~/components/Header"
import Overview from "~/features/overview/Overview"
import Transactions from "~/features/transactions/Transactions"
import authorize, {UserType} from "~/util/authorize.server"
import getUserId from "~/util/getUserId.server"
import {db} from "~/util/prisma.server"

export const loader: LoaderFunction = async ({request}) => {
  const authorized = await authorize(request, [UserType.AUTHENTICATED])
  if (!authorized) return redirect(`/`)

  const userId = (await getUserId(request))!
  const transactions = await db.transaction.findMany({where: {userId}, orderBy: {timestamp: `desc`}})
  return transactions
}

const DashboardLayout: FC = () => {
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <Header />
      <div
        className="h-full p-6 pt-0 grid grid-rows-[1fr] grid-cols-[30rem_1fr] gap-4"
        style={{gridTemplateAreas: `"transactions overview"`}}
      >
        <div className="h-full [grid-area:transactions] relative flex flex-col items-stretch children:flex-[1_1_0px]">
          <Transactions />
        </div>
        <div className="h-full [grid-area:overview] relative flex flex-col items-stretch children:flex-[1_1_0px]">
          <Overview />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
