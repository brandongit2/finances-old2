import clsx from "clsx"

import type {FC} from "react"

const Card: FC<JSX.IntrinsicElements[`div`]> = ({children, className, ...props}) => {
  return (
    <div {...props} className={clsx(`bg-olive-1 p-6 rounded-md`, className)}>
      {children}
    </div>
  )
}

export default Card
