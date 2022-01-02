import clsx from "clsx"
import cuid from "cuid"
import dayjs from "dayjs"
import {useState} from "react"
import {useFetcher} from "remix"
import * as yup from "yup"

import type {Transaction} from "@prisma/client"
import type {FC} from "react"

import Button from "~/components/atoms/Button"
import PencilIcon from "~/components/icons/PencilIcon"
import TrashIcon from "~/components/icons/TrashIcon"
import TransactionForm from "~/features/transactions/TransactionForm"
import $ from "~/util/formatCurrency"
import {id} from "~/util/validation"

export type TDeleteTransaction = {id: string}
export const deleteTransactionSchema = yup.object().shape({id: id.required()})

type TransactionPreviewProps = {
  transaction: Transaction
  expanded?: boolean
  onExpand: () => void
  onCollapse: () => void
}

const TransactionPreview: FC<TransactionPreviewProps> = ({transaction, expanded = false, onExpand, onCollapse}) => {
  const fetcher = useFetcher()

  const [editMode, setEditMode] = useState<string | null>(null)

  if (editMode) {
    return <TransactionForm transaction={transaction} onClose={() => setEditMode(null)} />
  }

  const deleteTransaction = () => {
    fetcher.submit({id: transaction.id}, {method: `delete`, action: `/transaction`})
  }

  return (
    <div
      className={clsx(
        `-m-2 px-4 py-2 rounded-md transition-colors hover:bg-olive-5 flex flex-col gap-4`,
        expanded && `bg-olive-5`,
      )}
    >
      <div
        className=" flex justify-between items-center gap-2 cursor-pointer"
        onClick={() => (expanded ? onCollapse() : onExpand())}
      >
        <div className="flex flex-col">
          <span className="text-lg font-bold">{transaction.name}</span>
          <span className="text-olive-11 text-sm">{dayjs(transaction.createdAt).format(`MMM. DD, YYYY`)}</span>
        </div>
        <span>{$(transaction.amount)}</span>
      </div>

      {expanded && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            unstyled
            onClick={() => setEditMode(cuid())}
            className="px-4 py-2 bg-olive-3 rounded-md flex items-center justify-center gap-4"
          >
            <PencilIcon className="h-4 fill-current" />
            Edit
          </Button>
          <Button
            unstyled
            onClick={deleteTransaction}
            className="px-4 py-2 bg-olive-3 rounded-md flex items-center justify-center gap-4"
          >
            <TrashIcon className="h-4 fill-current" />
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}

export default TransactionPreview
