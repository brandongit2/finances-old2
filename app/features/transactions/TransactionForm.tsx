import {useEffect} from "react"
import {useFetcher} from "remix"
import * as yup from "yup"

import type {Transaction} from "@prisma/client"
import type {FC} from "react"
import type {MergeExclusive} from "type-fest"
import type {YupShape} from "~/types/YupShape"

import Button from "~/components/atoms/Button"
import Label from "~/components/atoms/Label"
import TextInput from "~/components/atoms/TextInput"
import FormError from "~/components/FormError"
import {currencyAmt} from "~/util/regex"
import {useValidation} from "~/util/useValidation"
import {id} from "~/util/validation"

const transactionShape = {
  name: yup.string().max(1000).required(),
  amount: yup
    .string()
    .test(`is-currency`, `Invalid transaction amount.`, (amount) => currencyAmt.test(amount || ``))
    .test(`max`, `Amount too large.`, (amount) => {
      if (!amount) return true
      if (!currencyAmt.test(amount)) return true

      const MAX_INT = 2147483647

      console.log(amount)
      const parseable = amount.replaceAll(/[^-0-9.]/g, ``)
      const number = Number(parseable)
      return number * 100 <= MAX_INT // x100 because the value in the DB is in cents
    })
    .test(`required`, `This field is required.`, (amount) => {
      if (!amount) return true

      return amount.length > 1
    }),
}

export type TCreateTransaction = {
  name: string
  amount: string // Validated to be a currency amount
}
export const createTransactionSchema = yup.object().shape<YupShape<TCreateTransaction>>(transactionShape)

export type TUpdateTransaction = TCreateTransaction & {id: string}
export const updateTransactionSchema = yup.object().shape<YupShape<TUpdateTransaction>>({
  ...transactionShape,
  id: id.required(),
})

type TransactionFormProps = MergeExclusive<{transaction: Transaction}, {create: boolean}> & {onClose?: () => void}

const TransactionForm: FC<TransactionFormProps> = ({transaction, create, onClose}) => {
  const fetcher = useFetcher()
  const {validate, errors} = useValidation<TCreateTransaction>(createTransactionSchema, fetcher.data)

  useEffect(() => {
    if (fetcher.type === `done` && Object.keys(fetcher.data).length === 0) onClose?.()
  }, [fetcher.type, fetcher.data, onClose])

  return (
    <fetcher.Form
      method={create ? `post` : `patch`}
      action="/transaction"
      autoComplete="off"
      className="p-4 rounded-md grid bg-olive-5 items-center"
    >
      {/* The transaction ID used for updating transactions */}
      <input className="hidden" name="id" value={transaction?.id} />

      <FormError messages={errors.root} marginBottom />

      <div className="flex flex-col items-start">
        <Label subdued className="text-right">
          Transaction name
        </Label>
        <TextInput initialValue={transaction?.name} name="name" autoComplete="none" {...validate(`name`)} autoFocus />
        <FormError messages={errors.name} />
      </div>

      <div className="h-4" />

      <div className="flex flex-col items-start">
        <Label subdued className="text-right">
          Transaction amount
        </Label>
        <TextInput
          type="currency"
          initialValue={transaction?.amount}
          name="amount"
          {...validate(`amount`)}
          onFocus={(e) => {
            // Automatically move selection to after the dollar sign
            e.target.setSelectionRange(1, 1)
          }}
        />
        <FormError messages={errors.amount} />
      </div>

      <div className="h-4" />

      <div className="flex gap-4">
        <Button type="submit" filled small>
          Submit
        </Button>
        <Button small onClick={() => onClose?.()}>
          Cancel
        </Button>
      </div>
    </fetcher.Form>
  )
}

export default TransactionForm
