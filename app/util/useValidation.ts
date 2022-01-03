import {useEffect, useState} from "react"
import {useActionData} from "remix"
import * as yup from "yup"

import type {YupShape} from "~/types/YupShape"
import type {ValidationErrorObj} from "~/util/validation"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useValidation<Obj>(schema: yup.ObjectSchema<YupShape<Obj>>, serverErrors?: ValidationErrorObj<Obj>) {
  const errorsFromServer = serverErrors || useActionData<ValidationErrorObj<Obj>>()
  const [errors, setErrors] = useState<ValidationErrorObj<Obj>>({})

  useEffect(() => {
    if (errorsFromServer) setErrors(errorsFromServer)
  }, [errorsFromServer])

  const hasSubmitted = !!errorsFromServer

  return {
    errors,
    validate(name: string): JSX.IntrinsicElements[`input`] {
      const fieldSchema = yup.reach(schema, name) as yup.AnySchema

      return {
        onChange(evt) {
          if (!hasSubmitted) return

          try {
            fieldSchema.validateSync(evt.target.value)
            setErrors((errors) => ({
              ...errors,
              [name]: undefined,
              root: undefined,
            }))
          } catch (err) {
            if (err instanceof yup.ValidationError) {
              const messages = err.errors
              setErrors((errors) => ({
                ...errors,
                [name]: messages,
                root: undefined,
              }))
            }
          }
        },
      }
    },
  }
}
