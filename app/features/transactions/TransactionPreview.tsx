import dayjs from "dayjs"

import type {Transaction} from "@prisma/client"
import type {FC} from "react"

import $ from "~/util/formatCurrency"

type TransactionPreviewProps = {
  transaction: Transaction
}

const TransactionPreview: FC<TransactionPreviewProps> = ({transaction}) => {
  return (
    <div className="-mx-2 px-4 py-2 flex justify-between items-center gap-2 rounded-md transition-colors hover:bg-olive-5">
      <div className="flex flex-col">
        <span className="text-lg font-bold">{transaction.name}</span>
        <span className="text-olive-11 text-sm">{dayjs(transaction.createdAt).format(`MMM. DD, YYYY`)}</span>
      </div>
      <span>{$(transaction.amount)}</span>
    </div>
  )
}

export default TransactionPreview
