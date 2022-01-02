import type {ActionFunction, LoaderFunction} from "remix"
import type {TNewTransaction} from "~/features/transactions/TransactionForm"

import {newTransactionSchema} from "~/features/transactions/TransactionForm"
import {db} from "~/util/prisma.server"
import {validate, ValidationError} from "~/util/validation"

export const action: ActionFunction = async ({request}) => {
  let _transactionDetails: TNewTransaction
  try {
    _transactionDetails = await validate<TNewTransaction>(request, newTransactionSchema)
  } catch (err) {
    if (!(err instanceof ValidationError)) throw err
    return err.errorObj
  }

  const transactionDetails = {
    ..._transactionDetails,
    amount: Number(_transactionDetails.amount.replace(`$`, ``)) * 100,
  }

  await db.transaction.create({data: transactionDetails})

  return {}
}

export const loader: LoaderFunction = async () => {
  throw new Response(undefined, {status: 404})
}
