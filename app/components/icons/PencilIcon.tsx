import {forwardRef} from "react"

import type {SVGProps, Ref} from "react"

const PencilIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001" xmlSpace="preserve" ref={ref} {...props}>
    <path d="m496.063 62.299-46.396-46.4c-21.2-21.199-55.69-21.198-76.888 0l-18.16 18.161 123.284 123.294 18.16-18.161c21.248-21.249 21.251-55.643 0-76.894zM22.012 376.747.251 494.268a15.002 15.002 0 0 0 17.48 17.482l117.512-21.763-113.231-113.24zM333.407 55.274 38.198 350.506l123.284 123.293 295.209-295.231z" />
  </svg>
)

const ForwardRef = forwardRef(PencilIcon)
export default ForwardRef
