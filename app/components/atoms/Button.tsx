import clsx from "clsx"
import {forwardRef} from "react"

type ButtonProps = {
  circle?: boolean
  filled?: boolean
  unstyled?: boolean
  small?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps & JSX.IntrinsicElements[`button`]>(function Button(
  {circle = false, filled = false, unstyled = false, small = false, children, className, ...props},
  ref,
) {
  return (
    <button
      type="button"
      {...props}
      ref={ref}
      className={
        unstyled
          ? className
          : clsx(
              `text-center my-0.5 select-none`,
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
})

export default Button
