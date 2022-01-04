import dayjs from "dayjs"
import faker from "faker"

import type {Prisma} from "@prisma/client"

import {randomInt} from "~/util/randomNumber"

export function buildTransactions(): Prisma.TransactionCreateWithoutUserInput[] {
  let datePointer = dayjs().startOf(`day`)
  const transactions: Prisma.TransactionCreateWithoutUserInput[] = []

  const avgTransactionsPerDay = 3
  const numDaysToGenerate = 500

  for (let i = 0; i < numDaysToGenerate; i++) {
    datePointer = datePointer.subtract(1, `day`)

    const numTransactionsToday = randomInt(avgTransactionsPerDay - 3, avgTransactionsPerDay + 3)
    for (let j = 0; j < numTransactionsToday; j++) {
      transactions.push({
        amount: randomInt(-300_00, 0),
        name: faker.random.arrayElement(vendors),
        timestamp: datePointer.add(randomInt(0, 24 * 60), `minute`).toISOString(),
      })
    }
  }

  return transactions
}

const vendors = [
  `Apple Music`,
  `App Store`,
  `Apple Store`,
  `Bell`,
  `Cornershop`,
  `Disney+`,
  `IGA`,
  `Instacart`,
  `Maxi`,
  `McDonald's`,
  `Metro`,
  `Netflix`,
  `Provigo`,
  `Spotify`,
  `STL`,
  `STM`,
  `Subway`,
  `Uber`,
  `Uber Eats`,
]
