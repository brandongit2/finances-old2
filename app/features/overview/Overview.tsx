import dayjs from "dayjs"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useLoaderData} from "remix"

import type {Transaction} from "@prisma/client"
import type {FC} from "react"

import abbreviateNumber from "~/util/abbreviateNumber"
import roundToNearestMultipleOf from "~/util/roundToNearestMultipleOf"

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

  const dataRangeX = useMemo(() => {
    let days = points.map((point) => point[0])
    return [Math.min(...days), Math.max(...days)]
  }, [points])

  // Data about where we are on the graph
  const [rangeX, setRangeX] = useState<[number, number]>([-300, 0])
  const rangeY: [number, number] = useMemo(() => {
    const balances = points.filter((point) => point[0] > rangeX[0] && point[0] < rangeX[1]).map((point) => point[1])
    return [Math.min(...balances), Math.max(...balances)]
  }, [points, rangeX])
  const mousePos = useRef<Vector | null>(null)

  // Transformation functions.
  // "Screen" coordinates use the top-left of the screen as the origin. +Y is down, +X is right.
  // "View" coordinates use the bottom-left of the SVG as the origin. +Y is down, +X is right.
  // "World" coordinates use an arbitrary (0, 0) as the origin. +Y is up, +X is right.
  const scaleScreenToView = useCallback((length: number): number => length / svgDims[1], [svgDims])
  const screenToView = useCallback(
    (vector: Vector): Vector => {
      let result: Vector = [...vector]
      result = subtract(result, svgPos)
      result = scale(result, 1 / svgDims[1])
      return result
    },
    [svgPos, svgDims],
  )

  const scaleViewToWorldX = useCallback(
    (length: number): number => (length * (rangeX[1] - rangeX[0])) / aspectRatio,
    [rangeX, aspectRatio],
  )
  const scaleViewToWorldY = useCallback((length: number): number => -length * (rangeY[1] - rangeY[0]), [rangeY])
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

  // Update mouse position using event handler
  useEffect(() => {
    const onMouseMove = (evt: MouseEvent) => {
      const screenMousePos: Vector = [evt.clientX, evt.clientY]
      mousePos.current = viewToWorld(screenToView(screenMousePos))
    }

    window.addEventListener(`mousemove`, onMouseMove)
    window.addEventListener(`wheel`, onMouseMove)
    return () => {
      window.removeEventListener(`mousemove`, onMouseMove)
      window.removeEventListener(`wheel`, onMouseMove)
    }
  }, [screenToView, viewToWorld])

  // Pan/zoom functions
  const pan = (amount: number) => {
    setRangeX((rangeX) => {
      let result: [number, number] = [...rangeX]
      result = add(result, [amount, amount])
      if (result[1] > 0) result = subtract(result, [result[1], result[1]])
      if (result[0] < dataRangeX[0]) result = add(result, [dataRangeX[0] - result[0], dataRangeX[0] - result[0]])
      return result
    })
  }

  const zoom = (factor: number) => {
    setRangeX((rangeX) => {
      let result: [number, number] = [...rangeX]
      if (!mousePos.current) return result
      result = scaleAbout(result, [mousePos.current[0], mousePos.current[0]], factor)
      if (Math.abs(result[1] - result[0]) > Math.abs(dataRangeX[1] - dataRangeX[0]))
        result = [dataRangeX[0], dataRangeX[1]]
      if (result[1] > 0) result = subtract(result, [result[1], result[1]])
      if (result[0] < dataRangeX[0]) result = add(result, [dataRangeX[0] - result[0], dataRangeX[0] - result[0]])
      return result
    })
  }

  // Handle click and drag to pan
  const onPointerMove: React.PointerEventHandler<SVGSVGElement> = (evt) => {
    if (evt.buttons === 0) return
    let mouseMovement = scaleViewToWorldX(scaleScreenToView(-evt.movementX))
    pan(mouseMovement)
  }

  // Handle scroll to zoom and also trackpad events
  const onWheel: React.WheelEventHandler<SVGSVGElement> = (evt) => {
    if (Math.abs(evt.deltaY) > Math.abs(evt.deltaX)) {
      let factor = evt.ctrlKey ? 100 : 400
      zoom(evt.deltaY / factor + 1)
    } else {
      pan(evt.deltaX)
    }
  }

  // Disable zooming in or out
  useEffect(() => {
    const onWheel = (evt: WheelEvent) => void evt.preventDefault()
    let onWheelOptions: AddEventListenerOptions = {passive: false}
    document.addEventListener(`wheel`, onWheel, onWheelOptions)

    const onTouchStart = (evt: TouchEvent) => void evt.preventDefault()
    let onTouchStartOptions: AddEventListenerOptions = {passive: true}
    document.addEventListener(`touchstart`, onTouchStart, onTouchStartOptions)

    return () => {
      document.removeEventListener(`wheel`, onWheel, onWheelOptions)
      document.removeEventListener(`touchstart`, onTouchStart, onTouchStartOptions)
    }
  }, [])

  // Axis tick logic
  const preferredTickSpacing = 64 // in pixels
  type Tick = {pos: number; label: string}

  let ticksX = useMemo((): Tick[] => {
    let ticks: Tick[] = []
    let preferredTickXSpacing = scaleViewToWorldX(scaleScreenToView(preferredTickSpacing))
    let interval = 10 ** Math.floor(Math.log10(Math.abs(rangeX[0])) - 1)
    let tickSpacing = roundToNearestMultipleOf(preferredTickXSpacing, interval)
    if (tickSpacing === 0) tickSpacing += interval
    const smallestTick = Math.ceil(-rangeX[1] / tickSpacing)
    const largestTick = Math.floor(-rangeX[0] / tickSpacing)
    for (let i = smallestTick; i <= largestTick; i++) {
      let worldPos = i * -tickSpacing
      ticks.push({
        pos: viewToScreen(worldToView([worldPos, 0]))[0] - svgPos[0],
        label: String(-worldPos),
      })
    }
    return ticks
  }, [rangeX, scaleScreenToView, scaleViewToWorldX, svgPos, viewToScreen, worldToView])

  const ticksY = useMemo((): Tick[] => {
    let ticks: Tick[] = []
    let preferredTickYSpacing = scaleViewToWorldY(scaleScreenToView(-preferredTickSpacing))
    let interval = 10 ** Math.floor(Math.log10(rangeY[1]) - 1)
    let tickSpacing = roundToNearestMultipleOf(preferredTickYSpacing, interval)
    if (tickSpacing === 0) tickSpacing += interval
    const smallestTick = Math.ceil(rangeY[0] / tickSpacing)
    const largestTick = Math.floor(rangeY[1] / tickSpacing)
    for (let i = smallestTick; i <= largestTick; i++) {
      let worldPos = i * tickSpacing
      ticks.push({
        pos: viewToScreen(worldToView([0, worldPos]))[1] - svgPos[1],
        label: abbreviateNumber(worldPos / 100),
      })
    }
    return ticks
  }, [rangeY, scaleScreenToView, scaleViewToWorldY, svgPos, viewToScreen, worldToView])

  return (
    <div className="bg-olive-1 dark:bg-olive-3 rounded-lg light:shadow-[0px_0px_20px_0px_var(--olive-5)] p-4 grid grid-cols-[3rem_1fr] grid-rows-[1fr_2rem]">
      {/* Y axis */}
      <div className="relative">
        {/* Axis */}
        <div className="absolute top-0 right-0 h-full w-0.5 bg-olive-6" />

        {/* Tick marks */}
        {ticksY.map(({pos, label}) => (
          <div key={pos} className="absolute left-0 top-0 h-0 w-12" style={{transform: `translateY(${pos}px)`}}>
            <div className="absolute w-full transform -translate-y-1/2 flex justify-end items-center gap-2">
              <span className="text-xs text-olive-9">{label}</span>
              <div className="basis-2 flex-shrink-0 h-0.5 bg-olive-6" />
            </div>
          </div>
        ))}
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

      {/* Empty corner */}
      <div />

      {/* X axis */}
      <div className="relative">
        {/* Axis */}
        <div className="absolute top-0 right-0 w-full h-0.5 bg-olive-6" />

        {/* Tick marks */}
        {ticksX.map(({pos, label}) => (
          <div key={pos} className="absolute left-0 top-0 h-8 w-0" style={{transform: `translateX(${pos}px)`}}>
            <div className="absolute w-full transform -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="basis-2 flex-shrink-0 w-0.5 bg-olive-6" />
              <span className="text-xs text-olive-9">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Overview
