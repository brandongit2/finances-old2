import clsx from "clsx"

import type {FC} from "react"

const Label: FC<JSX.IntrinsicElements[`label`]> = ({children, className, ...props}) => {
  return (
    <label {...props} className={clsx(`font-semibold text-sm`, className)}>
      {children}
    </label>
  )
}

export default Label
