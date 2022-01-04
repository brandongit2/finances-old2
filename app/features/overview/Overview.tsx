import dayjs from "dayjs"
import {useCallback, useState} from "react"
import {useLoaderData} from "remix"

import type {Transaction} from "@prisma/client"
import type {FC} from "react"

const Overview: FC = () => {
  const _transactions = useLoaderData<Transaction[]>()
  const transactions: Transaction[] = [_transactions[0]]
  _transactions.forEach((transaction) => {
    const curDate = dayjs(transaction.timestamp)
    const prevDate = dayjs(transactions.at(-1)!.timestamp)
    if (curDate.isBefore(prevDate) && !curDate.isSame(prevDate, `day`)) {
      transactions.push(transaction)
    }
  })

  const balances = transactions.map((transaction) => transaction.balanceAfter)
  // In days relative to now
  const domain = [dayjs(transactions.at(-1)!.timestamp).diff(dayjs(), `day`), 0]
  const range = [0, Math.max(...balances)]
  const [svgDims, setSvgDims] = useState([1, 1])

  const x = (n: number) => ((n - domain[1]) / (domain[1] - domain[0])) * svgDims[0]
  const y = (n: number) => ((n - range[0]) / (range[1] - range[0])) * svgDims[1]

  const today = dayjs()
  const points = transactions.map((transaction) => [
    x(dayjs(transaction.timestamp).diff(today, `day`)),
    y(transaction.balanceAfter),
  ])

  const svgRef = useCallback((node: SVGSVGElement | null) => {
    if (!node) return

    const boundingBox = node.getBoundingClientRect()
    setSvgDims([boundingBox.width, boundingBox.height])
  }, [])

  return (
    <div className="bg-olive-1 dark:bg-olive-3 rounded-lg light:shadow-[0px_0px_20px_0px_var(--olive-5)] p-4 flex flex-col">
      <svg
        viewBox={`-${svgDims[0]} 0 ${svgDims[0]} ${svgDims[1]}`}
        preserveAspectRatio="none"
        className="w-full transform -scale-y-100 flex-[1_0_0px]"
        ref={svgRef}
      >
        <polyline
          points={points.map(([day, balance]) => `${day},${balance}`).join(` `)}
          className="stroke-grass-9 stroke-[0.5%] fill-[none] [stroke-linejoin:round]"
        />
      </svg>
    </div>
  )
}

export default Overview
