import clsx from "clsx"

import type {FC} from "react"

type FormErrorProps = {
  messages?: string[]
  marginBottom?: boolean
}

const FormError: FC<FormErrorProps & JSX.IntrinsicElements[`div`]> = ({
  messages,
  marginBottom = false,
  className,
  ...props
}) => {
  return (
    <div {...props} className={clsx(messages?.length && marginBottom && `pb-4`, className)}>
      {messages?.map((message) => (
        <p key={message} className="text-error text-sm">
          {message}
        </p>
      ))}
    </div>
  )
}

export default FormError
