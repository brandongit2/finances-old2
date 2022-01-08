import clsx from "clsx"
import dayjs from "dayjs"

import type {Transaction} from "@prisma/client"
import type {FC} from "react"

import $ from "~/util/formatCurrency"

type TransactionPreviewProps = {
  transaction: Transaction
  expanded?: boolean
  onExpand: () => void
  onCollapse: () => void
}

const TransactionPreview: FC<TransactionPreviewProps> = ({transaction, expanded = false, onExpand, onCollapse}) => {
  const transactionAmount = transaction.balanceAfter - transaction.balanceBefore

  return (
    <div
      className={clsx(
        `min-h-16 px-4 py-2 rounded-md transition-colors hover:bg-olive-5 flex flex-col gap-4`,
        expanded && `bg-olive-5`,
      )}
    >
      <div
        className=" flex justify-between items-center gap-2 cursor-pointer"
        onClick={() => (expanded ? onCollapse() : onExpand())}
      >
        <div className="flex flex-col">
          <span className="text-lg font-bold">{transaction.name}</span>
          <span className="text-olive-11 text-sm">{dayjs(transaction.timestamp).format(`MMM. DD, YYYY`)}</span>
        </div>
        <span>{$(transactionAmount)}</span>
      </div>

      {expanded && <div className="grid grid-cols-2 gap-2 -mx-0.5">blah blah blah</div>}
    </div>
  )
}

export default TransactionPreview
