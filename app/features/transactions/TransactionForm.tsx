import type {Transaction} from "@prisma/client"
import type {FC} from "react"
import type {MergeExclusive} from "type-fest"

import Button from "~/components/atoms/Button"
import Label from "~/components/atoms/Label"
import TextInput from "~/components/atoms/TextInput"

type TransactionFormProps = MergeExclusive<
  {
    transaction: Transaction
  },
  {create: boolean}
>

const TransactionForm: FC<TransactionFormProps> = ({transaction, create}) => {
  return (
    <form method={create ? `post` : `patch`} className="p-4 rounded-md grid bg-olive-5 gap-4 items-center">
      <div className="flex flex-col items-start">
        <Label subdued className="text-right">
          Transaction name
        </Label>
        <TextInput initialValue={transaction?.name} />
      </div>

      <div className="flex flex-col items-start">
        <Label subdued className="text-right">
          Transaction amount
        </Label>
        <TextInput type="currency" initialValue={transaction?.name} />
      </div>

      <div className="flex gap-4">
        <Button type="submit" filled small>
          Submit
        </Button>
        <Button small>Cancel</Button>
      </div>
    </form>
  )
}

export default TransactionForm
