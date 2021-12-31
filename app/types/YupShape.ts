import type * as yup from "yup"

export type YupShape<T> = Record<keyof Required<T>, yup.AnySchema>
