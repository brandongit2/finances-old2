import {Form, redirect, useLoaderData} from "remix"

import type {Account} from "@prisma/client"
import type {FC} from "react"
import type {FLoaderFunction} from "~/types/FLoaderFunction"

import TextInput from "~/components/atoms/TextInput"
import Header from "~/components/Header"
import Overview from "~/features/overview/Overview"
import Transactions from "~/features/transactions/Transactions"
import {createBankSchema, TCreateBank} from "~/routes/bank"
import authorize, {UserType} from "~/util/authorize.server"
import getUserId from "~/util/getUserId.server"
import {db} from "~/util/prisma.server"
import {useValidation} from "~/util/useValidation"

export type DashboardLoaderReturn = {
  accounts: Account[]
}

export const loader: FLoaderFunction<DashboardLoaderReturn> = async ({request}) => {
  const authorized = await authorize(request, [UserType.AUTHENTICATED])
  if (!authorized) return redirect(`/`)

  const userId = (await getUserId(request))!
  const accounts = await db.account.findMany({where: {userId}})
  if (accounts.length === 0) return redirect(`/setup`)

  return {accounts}
}

const DashboardLayout: FC = () => {
  const {accounts} = useLoaderData<DashboardLoaderReturn>()

  return (
    <div className="grid h-full grid-rows-[auto_1fr]">
      <Header />
      <div
        className="grid h-full grid-cols-[30rem_1fr] grid-rows-[1fr] gap-4 p-6 pt-0"
        style={{gridTemplateAreas: `"transactions overview"`}}
      >
        <div>You have no accounts. Click to add one.</div>
        {/* <div className="h-full [grid-area:transactions] relative flex flex-col items-stretch children:flex-[1_1_0px]">
          <Transactions />
        </div>
        <div className="h-full [grid-area:overview] relative flex flex-col items-stretch children:flex-[1_1_0px]">
          <Overview />
        </div> */}
      </div>
    </div>
  )
}

export default DashboardLayout
