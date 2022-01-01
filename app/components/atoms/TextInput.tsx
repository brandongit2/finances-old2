import clsx from "clsx"
import {useState} from "react"

import type {FC, HTMLInputTypeAttribute} from "react"

type TextInputProps = {
  initialValue?: string
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
    if (type === `currency` && !/^\$[0-9]*(\.[0-9]{0,2})?$/.test(evt.target.value)) return
    setValue(evt.target.value)
  }

  return (
    <input
      {...props}
      type={type === `currency` ? `text` : type}
      value={value}
      onChange={onChange}
      className={clsx(
        `w-full px-2 py-1 my-0.5 focus:bg-grassA-3 text-olive-12 border border-grass-8 rounded transition-colors`,
        className,
      )}
    >
      {children}
    </input>
  )
}

export default TextInput
