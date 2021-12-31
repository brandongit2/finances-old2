import clsx from "clsx"
import React from "react"

import type {FC} from "react"

type HeadingProps = {
  lvl: 1 | 2 | 3 | 4
}

const Heading: FC<HeadingProps & JSX.IntrinsicElements[`h1`]> = ({lvl, children, className, ...props}) => {
  let textSize = `text-3xl`
  if (lvl === 2) textSize = `text-2xl`
  if (lvl === 3) textSize = `text-xl`
  if (lvl === 4) textSize = `text-lg`

  return React.createElement<JSX.IntrinsicElements[`h1`]>(
    `h` + lvl,
    {
      ...props,
      className: clsx(`font-bold`, textSize, className),
    },
    children,
  )
}

export default Heading
