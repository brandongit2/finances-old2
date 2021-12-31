import type {Prisma, PrismaClient} from "@prisma/client"

import {hash} from "~/util/bcrypt.server"

export type CreateUserParams = Omit<Prisma.UserCreateInput, `passwordHash`> & {password: string}

export async function createUser(client: PrismaClient, params: CreateUserParams): Promise<CreateUserParams> {
  const passwordHash = hash(params.password)

  const {password, ...finalParams} = {...params, passwordHash}
  await client.user.create({data: finalParams})

  return params
}
