import faker from "faker"

import type {CreateUserParams} from "~/services/user.service"

import {buildTransactions} from "~/factories/transaction.factory"

export function buildUser(params?: Partial<CreateUserParams>): CreateUserParams {
  const firstName = params?.firstName ?? faker.name.firstName()
  const lastName = params?.lastName ?? faker.name.lastName()

  const user: CreateUserParams = {
    firstName,
    lastName,
    email: params?.email ?? `${firstName}.${lastName}@example.com`,
    password: params?.password ?? `password`,
    transactions: {create: buildTransactions()},
  }
  return user
}
