import clsx from "clsx"

import type {FC} from "react"

type ButtonProps = {
  circle?: boolean
  filled?: boolean
  unstyled?: boolean
  small?: boolean
}

const Button: FC<ButtonProps & JSX.IntrinsicElements[`button`]> = ({
  circle = false,
  filled = false,
  unstyled = false,
  small = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      {...props}
      className={
        unstyled
          ? className
          : clsx(
              `text-center my-0.5`,
              circle ? `rounded-full p-4` : `px-3 py-1 rounded font-semibold`,
              filled ? `bg-grass-9 text-grass-1` : `text-grass-11 border border-grass-8`,
              small && `text-sm`,
              className,
            )
      }
    >
      {children}
    </button>
  )
}

export default Button
