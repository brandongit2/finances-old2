import clsx from "clsx"

import type {FC} from "react"

type HrProps = {
  text?: string
}

const Hr: FC<HrProps & JSX.IntrinsicElements[`hr`]> = ({text, className, ...props}) => {
  return (
    <div {...props} className={clsx(`w-full flex gap-1 items-center`, className)}>
      <div className="h-px bg-olive-9 flex-grow" />
      {text && (
        <>
          <span className="text-sm text-olive-9 font-bold">{text}</span>
          <div className="h-px bg-olive-9 flex-grow" />
        </>
      )}
    </div>
  )
}

export default Hr
