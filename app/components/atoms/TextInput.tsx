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
          w-full px-2 py-1 my-0.5 focus:bg-grass-a-3 text-olive-12 border border-grass-8 rounded transition-colors
          autofill:shadow-[0px_0px_0px_100vw_var(--grass-3)_inset] autofill:[-webkit-text-fill-color:var(--olive-12)]
          autofill:transition-[background-color] autofill:duration-[5000s]
        `,
        className,
      )}
    >
      {children}
    </input>
  )
}

export default TextInput
