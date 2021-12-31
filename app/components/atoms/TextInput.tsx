import type {FC} from "react"

const TextInput: FC<JSX.IntrinsicElements[`input`]> = ({children, className, ...props}) => {
  return (
    <input
      type="text"
      {...props}
      className="w-full px-2 py-1 my-0.5 bg-grass-1 text-olive-12 border border-grass-8 rounded"
    >
      {children}
    </input>
  )
}

export default TextInput
