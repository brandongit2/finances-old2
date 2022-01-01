import type {Prisma} from "@prisma/client"

import {hash} from "~/util/bcrypt.server"
import {db} from "~/util/prisma.server"

export type CreateUserParams = Omit<Prisma.UserCreateInput, `passwordHash`> & {password: string}

export async function createUser(params: CreateUserParams): Promise<CreateUserParams> {
  const passwordHash = hash(params.password)

  const {password, ...finalParams} = {...params, passwordHash}
  await db.user.create({data: finalParams})

  return params
}
