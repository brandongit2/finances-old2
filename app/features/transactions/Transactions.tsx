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

  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [newTransactionFormKey, setNewTransactionFormKey] = useState<string | null>(null)

  return (
    <ScrollContainer className="bg-olive-1 dark:bg-olive-3 rounded-lg light:shadow-[0px_0px_20px_0px_var(--olive-5)]">
      <div className="pb-20 flex flex-col">
        <div className="sticky top-0 p-4 pb-0 bg-olive-1 dark:bg-olive-3">
          <Heading lvl={2}>Transactions</Heading>
          <Hr className="mt-4" />
        </div>
        <div className="mx-2 mt-2">
          {transactions.map((transaction) => (
            <TransactionPreview
              key={transaction.id}
              transaction={transaction}
              expanded={transaction.id === expandedTransaction}
              onExpand={() => setExpandedTransaction(transaction.id)}
              onCollapse={() => setExpandedTransaction(null)}
            />
          ))}
          {newTransactionFormKey && (
            <TransactionForm key={newTransactionFormKey} create onClose={() => setNewTransactionFormKey(null)} />
          )}
        </div>

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
            className="force-dark bg-olive-1 px-3 py-3 flex flex-col rounded-md"
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
    <Button
      unstyled
      {...props}
      className={clsx(`px-3 py-2 rounded transition-colors hover:bg-olive-3 select-none`, className)}
    >
      {children}
    </Button>
  )
}
