import dayjs from "dayjs"
import {mat3, vec2, vec3} from "gl-matrix"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useLoaderData} from "remix"

import type {Transaction} from "@prisma/client"
import type {FC} from "react"

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
  const _points = useMemo(
    () =>
      transactions.map((transaction) => [dayjs(transaction.timestamp).diff(today, `day`), transaction.balanceAfter]),
    [today, transactions],
  )

  const balances = useMemo(() => transactions.map((transaction) => transaction.balanceAfter), [transactions])
  const domain = useMemo(() => [dayjs(transactions.at(-1)!.timestamp).diff(dayjs(), `day`), 0], [transactions])
  const range = useMemo(() => [0, Math.max(...balances)], [balances])

  // Data about the SVG
  const [svgPos, setSvgPos] = useState([0, 0])
  const [svgDims, setSvgDims] = useState([1, 1])

  // Data about where we are on the graph
  const [translation, setTranslation] = useState(vec2.fromValues(0, 0))
  const [zoom, setZoom] = useState(1)
  const mousePos = useRef<vec3 | null>(null) // In world coordinates

  const localTranslation = useMemo(() => mat3.fromTranslation(mat3.create(), translation), [translation])
  const localTranslationInv = useMemo(() => mat3.invert(mat3.create(), localTranslation), [localTranslation])
  const localScale = useMemo(() => mat3.fromScaling(mat3.create(), vec2.fromValues(zoom, zoom)), [zoom])
  const localScaleInv = useMemo(() => mat3.invert(mat3.create(), localScale), [localScale])

  // Some useful transformations
  const translateScreenToView = useMemo(
    () => mat3.fromTranslation(mat3.create(), vec2.fromValues(-svgPos[0], -svgPos[1])),
    [svgPos],
  )
  const translateViewToScreen = useMemo(
    () => mat3.invert(mat3.create(), translateScreenToView),
    [translateScreenToView],
  )
  const scaleScreenToView = useMemo(
    () => mat3.fromScaling(mat3.create(), vec2.fromValues(1 / svgDims[1], 1 / svgDims[1])),
    [svgDims],
  )
  const scaleViewToScreen = useMemo(() => mat3.invert(mat3.create(), scaleScreenToView), [scaleScreenToView])

  const screenToView = useCallback(
    (vec: vec3) => {
      const result = vec3.clone(vec)
      vec3.transformMat3(result, result, translateScreenToView)
      vec3.transformMat3(result, result, scaleScreenToView)
      return result
    },
    [translateScreenToView, scaleScreenToView],
  )

  const translateWorldToView = useMemo(
    () => mat3.fromTranslation(mat3.create(), vec2.fromValues(-domain[0], -range[0])),
    [domain, range],
  )
  const translateViewToWorld = useMemo(() => mat3.invert(mat3.create(), translateWorldToView), [translateWorldToView])
  const scaleWorldToView = useMemo(
    () =>
      mat3.fromScaling(
        mat3.create(),
        vec2.fromValues((1 / (domain[1] - domain[0])) * (svgDims[0] / svgDims[1]), 1 / (range[0] - range[1])),
      ),
    [domain, svgDims, range],
  )
  const scaleViewToWorld = useMemo(() => mat3.invert(mat3.create(), scaleWorldToView), [scaleWorldToView])

  const worldToView = useCallback(
    (vec: vec3): vec3 => {
      const result = vec3.clone(vec)
      vec3.transformMat3(result, result, localTranslation)
      vec3.transformMat3(result, result, translateWorldToView)
      vec3.transformMat3(result, result, scaleWorldToView)
      return result
    },
    [localTranslation, translateWorldToView, scaleWorldToView],
  )

  useEffect(() => {
    const onMouseMove = (evt: MouseEvent) => {
      const screenMousePos = vec3.fromValues(evt.clientX, evt.clientY, 1)
      mousePos.current = screenToView(screenMousePos)
    }

    window.addEventListener(`mousemove`, onMouseMove)
    return () => void window.removeEventListener(`mousemove`, onMouseMove)
  }, [screenToView])

  const points = _points.map(([x, y]) => worldToView(vec3.fromValues(x, y, 1)))

  const svgRef = useCallback((node: SVGSVGElement | null) => {
    if (!node) return

    const resizeSvg = () => {
      const boundingBox = node.getBoundingClientRect()
      setSvgPos([boundingBox.left, boundingBox.top])
      setSvgDims([boundingBox.width, boundingBox.height])
    }
    resizeSvg()

    window.onresize = () => void resizeSvg()

    // node.onwheel = (evt) => {
    //   setZoom((zoom) => {
    //     let newZoom = zoom + evt.deltaY / 500
    //     if (newZoom < 0.1) newZoom = 0.1
    //     if (newZoom > 3) newZoom = 3
    //     return newZoom
    //   })
    // }
  }, [])

  const onPointerMove: React.PointerEventHandler<SVGSVGElement> = (evt) => {
    if (evt.buttons === 0) return
    const mouseMovement = vec3.fromValues(evt.movementX, evt.movementY, 1)

    vec3.transformMat3(mouseMovement, mouseMovement, scaleScreenToView)
    vec3.transformMat3(mouseMovement, mouseMovement, scaleViewToWorld)

    setTranslation((translation) =>
      vec2.add(vec2.create(), translation, vec2.fromValues(mouseMovement[0], mouseMovement[1])),
    )
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
          viewBox={`0 -1 ${svgDims[0] / svgDims[1]} 1`}
          preserveAspectRatio="none"
          className="w-full flex-[1_0_0px] cursor-grab active:cursor-grabbing"
          onPointerMove={onPointerMove}
          ref={svgRef}
        >
          <polyline
            points={points.map(([day, balance]) => `${day},${balance}`).join(` `)}
            className="stroke-grass-9 stroke-[0.5%] fill-[none] [stroke-linejoin:round]"
          />
        </svg>
      </div>
      <div />
      <div>x</div>
    </div>
  )
}

export default Overview
