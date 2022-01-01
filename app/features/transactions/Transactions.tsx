import * as Popover from "@radix-ui/react-popover"
import clsx from "clsx"
import {useState} from "react"
import {useLoaderData} from "remix"

import type {Transaction} from "@prisma/client"
import type {FC, ComponentProps} from "react"

import Button from "~/components/atoms/Button"
import Heading from "~/components/atoms/Heading"
import Hr from "~/components/atoms/Hr"
import PlusIcon from "~/components/icons/Plus"
import TransactionForm from "~/features/transactions/TransactionForm"
import TransactionPreview from "~/features/transactions/TransactionPreview"

const Transactions: FC = () => {
  const transactions = useLoaderData<Transaction[]>()

  const [transactionBeingEdited, setTransactionBeingEdited] = useState<string | null>(null)
  const [createTransaction, setCreateTransaction] = useState(false)

  return (
    <div className="p-4 bg-olive-3 rounded-lg relative flex flex-col gap-3">
      <Heading lvl={2}>Transactions</Heading>
      <Hr />
      {transactions.map((transaction) =>
        transaction.id === transactionBeingEdited ? (
          <TransactionForm key={transaction.id} transaction={transaction} />
        ) : (
          <TransactionPreview key={transaction.id} transaction={transaction} />
        ),
      )}

      {createTransaction && <TransactionForm create />}

      <div>
        <Popover.Root>
          <Popover.Trigger className="absolute bottom-4 right-4">
            <Button circle filled>
              <PlusIcon className="h-4 fill-grass-2" />
            </Button>
          </Popover.Trigger>
          <Popover.Content
            side="top"
            sideOffset={8}
            align="end"
            className="bg-olive-1 px-3 py-3 flex flex-col rounded-md"
          >
            <Popover.Close>
              <TransactionTypeButton onClick={() => setCreateTransaction(true)}>
                One-time transaction
              </TransactionTypeButton>
            </Popover.Close>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  )
}

export default Transactions

const TransactionTypeButton: FC<ComponentProps<typeof Button>> = ({children, className, ...props}) => {
  return (
    <Button unstyled {...props} className={clsx(`px-3 py-2 rounded transition-colors hover:bg-olive-3`, className)}>
      {children}
    </Button>
  )
}
