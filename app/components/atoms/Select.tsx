import clsx from "clsx"
import {forwardRef} from "react"

import type {ForwardRefRenderFunction} from "react"

const Select: ForwardRefRenderFunction<HTMLSelectElement, JSX.IntrinsicElements[`select`]> = (
  {children, className, ...props},
  ref,
) => {
  return (
    <select
      {...props}
      className={clsx(`my-0.5 rounded border border-grass-8 px-2 py-1 text-olive-12`, className)}
      ref={ref}
    >
      {children}
    </select>
  )
}

export default forwardRef(Select)
