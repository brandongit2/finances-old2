import * as Popover from "@radix-ui/react-popover"
import clsx from "clsx"
import cuid from "cuid"
import {useState} from "react"
import {useLoaderData} from "remix"

import type {Transaction} from "@prisma/client"
import type {FC, ComponentProps} from "react"

import Button from "~/components/atoms/Button"
import Heading from "~/components/atoms/Heading"
import Hr from "~/components/atoms/Hr"
import PlusIcon from "~/components/icons/Plus"
import ScrollContainer from "~/components/ScrollContainer"
import TransactionForm from "~/features/transactions/TransactionForm"
import TransactionPreview from "~/features/transactions/TransactionPreview"

const Transactions: FC = () => {
  const transactions = useLoaderData<Transaction[]>()

  const [transactionBeingEdited, setTransactionBeingEdited] = useState<string | null>(null)
  const [newTransactionFormKey, setNewTransactionFormKey] = useState<string | null>(null)

  return (
    <ScrollContainer className="bg-olive-3 rounded-lg">
      <div className="p-4 pb-20 flex flex-col gap-4">
        <Heading lvl={2}>Transactions</Heading>
        <Hr />
        {transactions.map((transaction) =>
          transaction.id === transactionBeingEdited ? (
            <TransactionForm key={transaction.id} transaction={transaction} />
          ) : (
            <TransactionPreview key={transaction.id} transaction={transaction} />
          ),
        )}
        {newTransactionFormKey && (
          <TransactionForm key={newTransactionFormKey} create onClose={() => setNewTransactionFormKey(null)} />
        )}

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
              <TransactionTypeButton onClick={() => setNewTransactionFormKey(cuid())}>
                One-time transaction
              </TransactionTypeButton>
            </Popover.Close>
          </Popover.Content>
        </Popover.Root>
      </div>
    </ScrollContainer>
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
