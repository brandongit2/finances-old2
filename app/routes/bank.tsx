import {Bank} from "@prisma/client"
import {Form, useLoaderData} from "remix"
import * as yup from "yup"

import type {FC} from "react"
import type {ActionFunction} from "remix"
import type {FLoaderFunction} from "~/types/FLoaderFunction"
import type {YupShape} from "~/types/YupShape"

import Button from "~/components/atoms/Button"
import Label from "~/components/atoms/Label"
import TextInput from "~/components/atoms/TextInput"
import {db} from "~/util/prisma.server"
import {validate, ValidationError} from "~/util/validation"

export type TCreateBank = {
  name: string
}

export const createBankSchema = yup.object().shape<YupShape<TCreateBank>>({
  name: yup.string().max(200).required(),
})

export const action: ActionFunction = async ({request}) => {
  switch (request.method) {
    case `POST`: {
      let bankDetails: TCreateBank
      try {
        bankDetails = await validate<TCreateBank>(request, createBankSchema)
      } catch (err) {
        if (!(err instanceof ValidationError)) throw err
        return err.errorObj
      }

      await db.bank.create({data: bankDetails})
      return null
    }
    default: {
      throw new Response(undefined, {status: 405})
    }
  }
}

type BankLoaderReturn = {
  banks: Bank[]
}

export const loader: FLoaderFunction<BankLoaderReturn> = async () => {
  const banks = await db.bank.findMany({})
  return {banks}
}

const Bank: FC = () => {
  const {banks} = useLoaderData<BankLoaderReturn>()

  return (
    <div>
      {banks.map((bank) => (
        <p key={bank.id}>{bank.name}</p>
      ))}
      <Form method="post" className="grid grid-cols-[auto_1fr] items-center gap-x-4">
        <Label>Bank name</Label>
        <TextInput name="name" />

        <div className="h-4 col-span-2" />

        <Button type="submit" className="col-start-2 mx-auto">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default Bank
