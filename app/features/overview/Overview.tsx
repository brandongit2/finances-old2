import dayjs from "dayjs"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useLoaderData} from "remix"

import type {Transaction} from "@prisma/client"
import type {FC} from "react"

type Vector = [number, number]

// Utility functions
const add = (vector: Vector, amount: Vector): Vector => [vector[0] + amount[0], vector[1] + amount[1]]
const subtract = (vector: Vector, amount: Vector): Vector => [vector[0] - amount[0], vector[1] - amount[1]]
const scale = (vector: Vector, factorX: number, factorY = factorX): Vector => [vector[0] * factorX, vector[1] * factorY]
const scaleAbout = (vector: Vector, origin: Vector, factorX: number, factorY = factorX): Vector => {
  let result: Vector = [...vector]
  result = subtract(result, origin)
  result = scale(result, factorX, factorY)
  result = add(result, origin)
  return result
}

const Overview: FC = () => {
  // Fetch the transactions
  const _transactions = useLoaderData<Transaction[]>()
  const transactions = useMemo(() => {
    const transactions: Transaction[] = [_transactions[0]]
    _transactions.forEach((transaction) => {
      const curDate = dayjs(transaction.timestamp)
      const prevDate = dayjs(transactions.at(-1)!.timestamp)
      if (curDate.isBefore(prevDate) && !curDate.isSame(prevDate, `day`)) {
        transactions.push(transaction)
      }
    })
    return transactions
  }, [_transactions])

  // Arrange the transactions into points
  const today = useMemo(() => dayjs(), [])
  const points = useMemo<Vector[]>(
    () =>
      transactions.map((transaction) => [dayjs(transaction.timestamp).diff(today, `day`), transaction.balanceAfter]),
    [today, transactions],
  )

  // Data about the SVG
  const [svgPos, setSvgPos] = useState<[number, number]>([0, 0])
  const [svgDims, setSvgDims] = useState<[number, number]>([1, 1])
  const aspectRatio = svgDims[0] / svgDims[1]

  // Data about where we are on the graph
  const [rangeX, setRangeX] = useState<[number, number]>([-300, 0])
  const rangeY: [number, number] = useMemo(() => {
    const balances = points.filter((point) => point[0] > rangeX[0] && point[0] < rangeX[1]).map((point) => point[1])
    return [0, Math.max(...balances)]
  }, [points, rangeX])
  const mousePos = useRef<Vector | null>(null)

  // Transformation functions.
  // "Screen" coordinates use the top-left of the screen as the origin. +Y is down, +X is right.
  // "View" coordinates use the bottom-left of the SVG as the origin. +Y is down, +X is right.
  // "World" coordinates use an arbitrary (0, 0) as the origin. +Y is up, +X is right.
  const screenToView = useCallback(
    (vector: Vector): Vector => {
      let result: Vector = [...vector]
      result = subtract(result, svgPos)
      result = scale(result, 1 / svgDims[1])
      return result
    },
    [svgPos, svgDims],
  )

  const viewToWorld = useCallback(
    (vector: Vector): Vector => {
      let result: Vector = [...vector]
      result = scale(result, 1, -1)
      result = add(result, [0, 1])
      result = scale(result, (rangeX[1] - rangeX[0]) / aspectRatio, rangeY[1] - rangeY[0])
      result = add(result, [rangeX[0], rangeY[0]])
      return result
    },
    [rangeX, rangeY, aspectRatio],
  )

  const worldToView = useCallback(
    (vector: Vector): Vector => {
      let result: Vector = [...vector]
      result = subtract(result, [rangeX[0], rangeY[0]])
      result = scale(result, aspectRatio / (rangeX[1] - rangeX[0]), 1 / (rangeY[1] - rangeY[0]))
      result = subtract(result, [0, 1])
      result = scale(result, 1, -1)
      return result
    },
    [rangeX, rangeY, aspectRatio],
  )

  const viewToScreen = useCallback(
    (vector: Vector): Vector => {
      let result: Vector = [...vector]
      result = scale(result, svgDims[1])
      result = add(result, svgPos)
      return result
    },
    [svgPos, svgDims],
  )

  useEffect(() => {
    const onMouseMove = (evt: MouseEvent) => {
      const screenMousePos: Vector = [evt.clientX, evt.clientY]
      mousePos.current = viewToWorld(screenToView(screenMousePos))
    }

    window.addEventListener(`mousemove`, onMouseMove)
    return () => void window.removeEventListener(`mousemove`, onMouseMove)
  }, [screenToView, viewToWorld])

  const svgRef = useCallback((node: SVGSVGElement | null) => {
    if (!node) return

    const resizeSvg = () => {
      const boundingBox = node.getBoundingClientRect()
      setSvgPos([boundingBox.left, boundingBox.top])
      setSvgDims([boundingBox.width, boundingBox.height])
    }
    resizeSvg()

    window.onresize = () => void resizeSvg()
  }, [])

  const onPointerMove: React.PointerEventHandler<SVGSVGElement> = (evt) => {
    if (evt.buttons === 0) return
    let mouseMovement = evt.movementX
    mouseMovement /= svgDims[1]
    mouseMovement *= (rangeX[1] - rangeX[0]) / aspectRatio
    mouseMovement *= -1
    setRangeX((rangeX) => [rangeX[0] + mouseMovement, rangeX[1] + mouseMovement])
  }

  const onWheel: React.WheelEventHandler<SVGSVGElement> = (evt) => {
    setRangeX((rangeX) => {
      let result: [number, number] = [...rangeX]
      if (!mousePos.current) return result
      result = scaleAbout(result, [mousePos.current[0], mousePos.current[0]], evt.deltaY / 400 + 1)
      return result
    })
  }

  // const yTicks = Array(Math.abs(domain[1] - domain[0]))
  //   .fill(undefined)
  //   .map((_, i) => i + domain[0])
  // .map((tick) => )

  return (
    <div className="bg-olive-1 dark:bg-olive-3 rounded-lg light:shadow-[0px_0px_20px_0px_var(--olive-5)] p-4 grid grid-cols-[auto_1fr] grid-rows-[1fr_auto]">
      <div className="relative">
        <div className="h-full w-1 bg-olive-5" />
        {/* {yTicks.map((tick) => (
          <div
            key={tick}
            className="w-4 h-1 bg-olive-5 absolute left-0 top-0"
            style={{transform: `translateY(${tick}px)`}}
          />
        ))} */}
      </div>
      <div className="flex flex-col">
        <svg
          viewBox={`0 0 ${aspectRatio} 1`}
          preserveAspectRatio="none"
          className="w-full flex-[1_0_0px] cursor-grab active:cursor-grabbing"
          onPointerMove={onPointerMove}
          onWheel={onWheel}
          ref={svgRef}
        >
          <polyline
            points={points
              .map((point) => worldToView(point))
              .map(([day, balance]) => `${day},${balance}`)
              .join(` `)}
            className="stroke-grass-9 stroke-[0.5%] fill-[none] [stroke-linejoin:round] [stroke-linecap:round]"
          />
        </svg>
      </div>
      <div />
      <div>x</div>
    </div>
  )
}

export default Overview
