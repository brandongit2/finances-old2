import clsx from "clsx"

import type {FC} from "react"

type ButtonProps = {
  filled?: boolean
}

const Button: FC<ButtonProps & JSX.IntrinsicElements[`button`]> = ({filled = false, children, className, ...props}) => {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        `px-2 py-1 border border-grass-8 rounded font-semibold`,
        filled ? `bg-grass-8 text-grass-1` : `text-grass-11`,
        className,
      )}
    >
      {children}
    </button>
  )
}

export default Button
