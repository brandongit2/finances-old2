import * as Popover from "@radix-ui/react-popover"
import clsx from "clsx"
import cuid from "cuid"
import dayjs from "dayjs"
import {useCallback, useState} from "react"
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
  const _transactions = useLoaderData<Transaction[]>()
  const transactions: Record<string, Transaction[]> = {}
  _transactions.forEach((transaction) => {
    const timestamp = dayjs(transaction.timestamp).format(`YYYY-MM-DD`)
    transactions[timestamp] ??= []
    transactions[timestamp].push(transaction)
  })

  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [newTransactionFormKey, setNewTransactionFormKey] = useState<string | null>(null)

  const [scrollPos, setScrollPos] = useState(0)
  const [containerHeight, setContainerHeight] = useState<number>(1200)

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return

    const onResize = () => {
      setContainerHeight(node.getBoundingClientRect().height)
    }
    onResize()

    window.addEventListener(`resize`, onResize)

    node.addEventListener(`scroll`, () => {
      setScrollPos(node.scrollTop)
    })
  }, [])

  const itemHeight = 64
  let limitTop = Math.max(Math.floor(scrollPos / itemHeight) - 5, 0)
  let limitBottom = Math.min(Math.ceil(limitTop + 10 + containerHeight / itemHeight), _transactions.length)
  let itemsToRender = _transactions.map((transaction) => transaction.id).slice(limitTop, limitBottom)
  console.log(limitTop, limitBottom)

  return (
    <ScrollContainer
      className="bg-olive-1 dark:bg-olive-3 rounded-lg light:shadow-[0px_0px_20px_0px_var(--olive-5)]"
      ref={containerRef}
    >
      <div className="pb-20 flex flex-col">
        <div className="sticky top-0 h-16 bg-olive-1 dark:bg-olive-3 flex flex-col justify-around z-[3]">
          <Heading lvl={2} className="mx-4">
            Transactions
          </Heading>
          <Hr className="absolute bottom-0" />
        </div>

        {/* The vertical dotted line */}
        <div className="absolute h-full w-12 left-5 pointer-events-none">
          <div className="hard-center h-full border-2 border-olive-5 border-dotted" />
        </div>

        <div>
          {newTransactionFormKey && (
            <div className="ml-[5.5rem] m-4">
              <TransactionForm key={newTransactionFormKey} create onClose={() => setNewTransactionFormKey(null)} />
            </div>
          )}

          <div style={{height: `${itemHeight * _transactions.length}px`}}>
            <div style={{height: `${itemHeight * limitTop}px`}} />
            {Object.entries(transactions).map(([day, dayTransactions]) => {
              const children = dayTransactions
                .filter((transaction) => itemsToRender.includes(transaction.id))
                .map((transaction) => (
                  <TransactionPreview
                    key={transaction.id}
                    transaction={transaction}
                    expanded={transaction.id === expandedTransaction}
                    onExpand={() => setExpandedTransaction(transaction.id)}
                    onCollapse={() => setExpandedTransaction(null)}
                  />
                ))

              if (children.length === 0) return null
              return (
                <div key={day} className="grid grid-cols-[3rem_1fr] gap-1 ml-5 mr-2">
                  {/* The date circle thing */}
                  <div className="justify-self-center sticky top-[4.5rem] mt-2 bg-olive-7 w-12 h-12 rounded-full flex flex-col items-center justify-center z-[2]">
                    <span className="text-xs -mb-1">{dayjs(day).format(`MMM`)}</span>
                    <span className="font-bold">{dayjs(day).format(`D`)}</span>
                  </div>
                  <div>{children}</div>
                </div>
              )
            })}
          </div>
        </div>

        <Popover.Root>
          <Popover.Trigger asChild className="absolute bottom-4 right-4">
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
