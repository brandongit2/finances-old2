import * as yup from "yup"

import type {ActionFunction} from "remix"
import type {YupShape} from "~/types/YupShape"

import {getSession} from "~/sessions.server"
import {db} from "~/util/prisma.server"
import {validate, ValidationError} from "~/util/validation"

export type TCreateAccount = {
  name: string
  bankId: string
}

export const createAccountSchema = yup.object().shape<YupShape<TCreateAccount>>({
  name: yup.string().max(200).required(),
  bankId: yup.string().max(200).required(),
})

export const action: ActionFunction = async ({request}) => {
  switch (request.method) {
    case `POST`: {
      let accountDetails: TCreateAccount
      try {
        accountDetails = await validate<TCreateAccount>(request, createAccountSchema)
      } catch (err) {
        if (!(err instanceof ValidationError)) throw err
        return err.errorObj
      }

      const session = await getSession(request.headers.get(`Cookie`))
      const userId = session.get(`userId`)
      await db.account.create({
        data: {
          name: accountDetails.name,
          user: {connect: {id: userId}},
          bank: {connect: {id: accountDetails.bankId}},
        },
      })
      return null
    }
    default: {
      throw new Response(undefined, {status: 405})
    }
  }
}
