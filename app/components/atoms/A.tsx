import clsx from "clsx"

import type {FC} from "react"

const A: FC<JSX.IntrinsicElements[`a`]> = ({children, className, ...props}) => {
  return (
    <a {...props} className={clsx(`text-grass-11 underline`, className)}>
      {children}
    </a>
  )
}

export default A
