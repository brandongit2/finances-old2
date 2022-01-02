import {forwardRef} from "react"

import type {SVGProps, Ref} from "react"

const TrashIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" ref={ref} {...props}>
    <path d="M459.125 37.25H341.937l-9.18-18.262A23.437 23.437 0 0 0 311.761 6h-111.62a23.163 23.163 0 0 0-20.898 12.988l-9.18 18.262H52.875c-8.629 0-15.625 6.996-15.625 15.625v31.25c0 8.629 6.996 15.625 15.625 15.625h406.25c8.629 0 15.625-6.996 15.625-15.625v-31.25c0-8.629-6.996-15.625-15.625-15.625zM89.203 462.055c1.547 24.7 22.029 43.942 46.777 43.945h240.04c24.748-.003 45.231-19.245 46.777-43.945L443.5 131h-375z" />
  </svg>
)

const ForwardRef = forwardRef(TrashIcon)
export default ForwardRef
