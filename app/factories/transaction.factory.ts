import dayjs from "dayjs"
import faker from "faker"

import type {Prisma} from "@prisma/client"

import {randomInt} from "~/util/randomNumber"

export function buildTransactions(): Prisma.TransactionCreateWithoutUserInput[] {
  let datePointer = dayjs().startOf(`day`)
  const transactions: Prisma.TransactionCreateWithoutUserInput[] = []

  const avgTransactionsPerDay = 3
  const numDaysToGenerate = 500

  let totalBalance = 50000_00
  for (let i = 0; i < numDaysToGenerate; i++) {
    datePointer = datePointer.subtract(1, `day`)

    // Paycheques
    if (i % 14 === 0) {
      transactions.push({
        balanceBefore: totalBalance - 2000_00,
        balanceAfter: totalBalance,
        name: `Paycheque`,
        timestamp: datePointer.toISOString(),
      })
      totalBalance -= 2000_00
    }

    const numTransactionsToday = randomInt(avgTransactionsPerDay - 3, avgTransactionsPerDay + 3)
    const transactionTimes = Array(numTransactionsToday)
      .fill(undefined)
      .map(() => datePointer.add(randomInt(10 * 60, 23 * 60), `minute`))
      .sort((a, b) => (a.isBefore(b) ? -1 : 1))
      .map((date) => date.toISOString())
    for (let j = 0; j < numTransactionsToday; j++) {
      const expensivePurchase = Math.random() < 0.008 && totalBalance > 41000_00

      const amountSpent = expensivePurchase ? randomInt(1500_00, 40000_00) : randomInt(1_00, 35_00)
      transactions.push({
        balanceBefore: totalBalance + amountSpent,
        balanceAfter: totalBalance,
        name: faker.random.arrayElement(expensivePurchase ? expensiveVendors : cheapVendors),
        timestamp: transactionTimes[j],
      })
      totalBalance += amountSpent
    }
  }

  return transactions
}

const cheapVendors = [
  `Apple Music`,
  `App Store`,
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
const expensiveVendors = [`Apple Store`, `Tesla`]
