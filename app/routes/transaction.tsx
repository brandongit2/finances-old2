import {redirect} from "remix"

import type {Prisma} from "@prisma/client"
import type {ActionFunction, LoaderFunction} from "remix"
import type {TCreateTransaction} from "~/features/transactions/TransactionForm"

import {createTransactionSchema} from "~/features/transactions/TransactionForm"
import authorize, {UserType} from "~/util/authorize.server"
import getUserId from "~/util/getUserId.server"
import {db} from "~/util/prisma.server"
import {validate, ValidationError} from "~/util/validation"

export const action: ActionFunction = async ({request}) => {
  const authorized = await authorize(request, [UserType.AUTHENTICATED])
  if (!authorized) return redirect(`/`)

  switch (request.method) {
    case `POST`: {
      let _transactionDetails: TCreateTransaction
      try {
        _transactionDetails = await validate<TCreateTransaction>(request, createTransactionSchema)
      } catch (err) {
        if (!(err instanceof ValidationError)) throw err
        return err.errorObj
      }

      const userId = (await getUserId(request))!
      const user = await db.user.findUnique({where: {id: userId}, select: {currentBalance: true}})
      if (!user) throw new Response(null, {status: 403})
      const transactionDetails: Prisma.TransactionCreateInput = {
        name: _transactionDetails.name,
        balanceBefore: user.currentBalance,
        balanceAfter: user.currentBalance + Number(_transactionDetails.amount.replace(`$`, ``)) * 100,
        user: {connect: {id: userId}},
      }

      await db.transaction.create({data: transactionDetails})

      return {}
    }
  }
}

export const loader: LoaderFunction = async () => {
  throw new Response(undefined, {status: 404})
}
