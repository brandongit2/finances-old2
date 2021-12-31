import clsx from "clsx"

import type {FC} from "react"

const Card: FC<JSX.IntrinsicElements[`div`]> = ({children, className, ...props}) => {
  return (
    <div
      {...props}
      className={clsx(`theme-invert bg-olive-1 p-6 rounded-md shadow-[0px_0px_20px_0px_var(--oliveDark6)]`, className)}
    >
      {children}
    </div>
  )
}

export default Card
