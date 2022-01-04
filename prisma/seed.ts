import {buildUser} from "../app/factories/user.factory"
import {createUser} from "../app/services/user.service"

async function seed() {
  await createUser(
    buildUser({
      firstName: `User`,
      lastName: `One`,
      email: `user.one@example.com`,
    }),
  )
}

seed()
