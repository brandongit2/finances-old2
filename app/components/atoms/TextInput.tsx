import clsx from "clsx"
import {useState} from "react"

import type {FC, HTMLInputTypeAttribute} from "react"

import {currencyAmt} from "~/util/regex"

type TextInputProps = {
  initialValue?: string | number
  type?: HTMLInputTypeAttribute | `currency`
}

const TextInput: FC<Omit<JSX.IntrinsicElements[`input`], `type` | `value`> & TextInputProps> = ({
  initialValue = ``,
  type = `text`,
  children,
  className,
  ...props
}) => {
  const [value, setValue] = useState((type === `currency` ? `$` : ``) + initialValue)

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (type === `currency` && !currencyAmt.test(evt.target.value)) return
    setValue(evt.target.value)
  }

  return (
    <input
      {...props}
      type={type === `currency` ? `text` : type}
      value={value}
      onChange={onChange}
      className={clsx(
        `
          my-0.5 w-full rounded border border-grass-8 px-2 py-1 text-olive-12 transition-colors focus:bg-grass-a-3
          autofill:shadow-[0px_0px_0px_100vw_var(--grass-3)_inset] autofill:transition-[background-color]
          autofill:duration-[5000s] autofill:[-webkit-text-fill-color:var(--olive-12)]
        `,
        className,
      )}
    >
      {children}
    </input>
  )
}

export default TextInput
