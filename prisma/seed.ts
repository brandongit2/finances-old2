import {PrismaClient} from "@prisma/client"

import {buildUser} from "../app/factories/user.factory"
import {createUser} from "../app/services/user.service"

async function seed() {
  const client = new PrismaClient()

  await createUser(client, buildUser())
}

seed()
