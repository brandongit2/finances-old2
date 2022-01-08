import dayjs from "dayjs"
import faker from "faker"

import type {Prisma} from "@prisma/client"

import {randomFloat, randomInt} from "~/util/randomNumber"

export function buildTransactions(): Prisma.TransactionCreateWithoutUserInput[] {
  let datePointer = dayjs().startOf(`day`)
  const transactions: Prisma.TransactionCreateWithoutUserInput[] = []

  const avgTransactionsPerDay = 3
  const numDaysToGenerate = 365 * 10

  let totalBalance = 600_000_00
  let paycheque = 4000_00 // Every two weeks
  let rent = 3400_00 // Every month

  const makePurchase = (name: string, amount: number) => {
    transactions.push({
      balanceBefore: totalBalance - amount,
      balanceAfter: totalBalance,
      name: name,
      timestamp: datePointer.toISOString(),
    })
    totalBalance -= amount
  }

  for (let i = 0; i < numDaysToGenerate; i++) {
    datePointer = datePointer.subtract(1, `day`)

    // Paycheques
    if (i % 14 === 0) makePurchase(`Paycheque`, paycheque)
    if (Math.random() < 0.002) paycheque = Math.round(paycheque / randomFloat(1.3, 1.9))

    // Rent
    if (i % 30 === 0) makePurchase(`Rent`, rent)
    if (Math.random() < 0.004) rent = Math.round(rent / randomFloat(0.9, 1.4))

    const numTransactionsToday = randomInt(avgTransactionsPerDay - 3, avgTransactionsPerDay + 3)
    const transactionTimes = Array(numTransactionsToday)
      .fill(undefined)
      .map(() => datePointer.add(randomInt(10 * 60, 23 * 60), `minute`))
      .sort((a, b) => (a.isBefore(b) ? -1 : 1))
      .map((date) => date.toISOString())
    for (let j = 0; j < numTransactionsToday; j++) {
      const expensivePurchase = Math.random() < 0.05

      const amountSpent = expensivePurchase ? randomInt(50_00, 200_00) : randomInt(1_00, 25_00)
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
  `Disney+`,
  `McDonald's`,
  `Netflix`,
  `Spotify`,
  `STL`,
  `STM`,
  `Subway`,
  `Uber`,
  `Uber Eats`,
]
const expensiveVendors = [`Apple Store`, `Bell`, `Cornershop`, `IGA`, `Instacart`, `Maxi`, `Metro`, `Provigo`]
