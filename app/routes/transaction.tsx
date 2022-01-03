import type {ActionFunction, LoaderFunction} from "remix"
import type {TCreateTransaction, TUpdateTransaction} from "~/features/transactions/TransactionForm"
import type {TDeleteTransaction} from "~/features/transactions/TransactionPreview"

import {updateTransactionSchema, createTransactionSchema} from "~/features/transactions/TransactionForm"
import {deleteTransactionSchema} from "~/features/transactions/TransactionPreview"
import {db} from "~/util/prisma.server"
import {validate, ValidationError} from "~/util/validation"

export const action: ActionFunction = async ({request}) => {
  try {
    switch (request.method) {
      case `POST`: {
        let _transactionDetails: TCreateTransaction
        try {
          _transactionDetails = await validate<TCreateTransaction>(request, createTransactionSchema)
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
      case `PATCH`: {
        let _transactionDetails: TUpdateTransaction
        try {
          _transactionDetails = await validate<TUpdateTransaction>(request, updateTransactionSchema)
        } catch (err) {
          if (!(err instanceof ValidationError)) throw err
          return err.errorObj
        }

        const transactionDetails = {
          ..._transactionDetails,
          amount: Number(_transactionDetails.amount.replace(`$`, ``)) * 100,
        }

        await db.transaction.update({where: {id: transactionDetails.id}, data: transactionDetails})

        return {}
      }
      case `DELETE`: {
        let body: TDeleteTransaction
        try {
          body = await validate<TDeleteTransaction>(request, deleteTransactionSchema)
        } catch (err) {
          if (!(err instanceof ValidationError)) throw err
          return err.errorObj
        }

        await db.transaction.delete({where: {id: body.id}})
        return {}
      }
    }
  } catch (err) {
    console.error(err)
  }
}

export const loader: LoaderFunction = async () => {
  throw new Response(undefined, {status: 404})
}
