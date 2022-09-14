import {createUser} from "~/services/user.service"

async function seed() {
  await createUser({
    firstName: `User`,
    lastName: `One`,
    email: `user.one@example.com`,
    password: `password`,
  })
}

seed()
