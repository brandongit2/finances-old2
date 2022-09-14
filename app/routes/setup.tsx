import {Link, useFetcher, useLoaderData} from "remix"

import type {Account, Bank} from "@prisma/client"
import type {FC} from "react"
import type {TCreateAccount} from "~/routes/account"
import type {FLoaderFunction} from "~/types/FLoaderFunction"

import Button from "~/components/atoms/Button"
import Card from "~/components/atoms/Card"
import Heading from "~/components/atoms/Heading"
import Label from "~/components/atoms/Label"
import Select from "~/components/atoms/Select"
import TextInput from "~/components/atoms/TextInput"
import FormError from "~/components/FormError"
import Header from "~/components/Header"
import {createAccountSchema} from "~/routes/account"
import {db} from "~/util/prisma.server"
import {useValidation} from "~/util/useValidation"

type SetupLoaderReturn = {
  accounts: Array<Account & {bank: Bank | null}>
  banks: Bank[]
}

export const loader: FLoaderFunction<SetupLoaderReturn> = async () => {
  const accounts = await db.account.findMany({include: {bank: true}})
  const banks = await db.bank.findMany({})
  return {accounts, banks}
}

const Setup: FC = () => {
  const {accounts, banks} = useLoaderData<SetupLoaderReturn>()
  const fetcher = useFetcher()

  const {validate, errors} = useValidation<TCreateAccount>(createAccountSchema, fetcher.data || null)

  return (
    <div className="h-full">
      <Header />
      <div className="grid h-[calc(100%-theme(spacing.20))] place-items-center">
        <div className="grid max-w-5xl grid-cols-[3fr_2fr] gap-6 rounded-lg border border-olive-4 p-6">
          <div className="flex flex-col gap-4">
            <Heading lvl={1} className="text-center">
              Let&apos;s get set up.
            </Heading>
            <Card className="force-light">
              <fetcher.Form method="post" action="/account" className="grid grid-cols-[auto_1fr] items-center gap-x-4">
                <Heading lvl={2} className="col-span-2">
                  Add your bank accounts
                </Heading>

                <FormError messages={errors.root} className="col-span-2" marginBottom />

                <div className="col-span-2 h-4" />

                <Label htmlFor="bank" className="justify-self-end">
                  Bank
                </Label>
                <Select id="bank" name="bankId">
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </Select>
                <FormError messages={errors.bankId} className="col-start-2" />

                <div className="col-span-2 h-4" />

                <Label htmlFor="accountName">Account name</Label>
                <TextInput id="accountName" name="name" />
                <FormError messages={errors.name} className="col-start-2" />

                <div className="col-span-2 h-4" />

                <Button type="submit" className="col-start-2 mx-auto">
                  Add
                </Button>
              </fetcher.Form>
            </Card>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto">
            {accounts.length === 0 ? (
              <p>You don&apos;t have any bank accounts so far.</p>
            ) : (
              accounts.map((account) => (
                <div key={account.id}>
                  <p className="text-xl font-bold">{account.bank?.name}</p>
                  <p>{account.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <Link to="/dashboard">Next</Link>
      </div>
    </div>
  )
}

export default Setup
