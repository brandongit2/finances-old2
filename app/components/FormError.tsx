import clsx from "clsx"

import type {FC} from "react"

const FormError: FC<JSX.IntrinsicElements[`p`]> = ({className, children, ...props}) => {
  if (!children) return null

  return (
    <p {...props} className={clsx(`text-error text-sm`, className)}>
      {children}
    </p>
  )
}

export default FormError
