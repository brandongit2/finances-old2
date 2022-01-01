import clsx from "clsx"

import type {FC} from "react"

type LabelProps = {
  subdued?: boolean
}

const Label: FC<LabelProps & JSX.IntrinsicElements[`label`]> = ({subdued = false, children, className, ...props}) => {
  return (
    <label {...props} className={clsx(`font-semibold`, subdued ? `text-xs text-olive-11` : `text-sm`, className)}>
      {children}
    </label>
  )
}

export default Label
