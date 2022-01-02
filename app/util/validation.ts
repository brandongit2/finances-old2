import * as yup from "yup"

import type {YupShape} from "~/types/YupShape"

import formDataToJson from "~/util/formDataToJson"

yup.setLocale({
  mixed: {
    required: `This field is required.`,
  },
  number: {
    min: ({min}) => `Number too small. The minimum for this field is ${min}.`,
    max: ({max}) => `Number too large. The maximum for this field is ${max}.`,
  },
  string: {
    min: ({min}) => `Text too short. Text must be at least ${min} characters long.`,
    max: ({max}) => `Text too long. Text must be at most ${max} characters long.`,
  },
})

export const id = yup.string().min(10).max(50)
export const email = yup.string().email(`Invalid email.`).max(500)
export const password = yup
  .string()
  .min(6, `Password too short.`)
  .max(500, ({max}) => `Password too long. The maximum for this field is ${max}`)

/*
 * 1. Take in a raw request and a Yup schema.
 * 2. Validate that:
 *    a. The request contains valid form data. If not, throw an Error.
 *    b. That form data matches the supplied schema. If not, throw an Error from where I can retreive error messages
 *       for the erroneous fields.
 * 3. Return the validated data.
 */
export async function validate<T>(request: Request, schema: yup.ObjectSchema<YupShape<T>>): Promise<T> {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    throw new Error(`Malformed form data.`)
  }
  const json = formDataToJson(formData)

  try {
    return schema.validateSync(json, {
      stripUnknown: true,
      abortEarly: false,
    }) as T
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors = err.inner
      let errorObj = {}

      // Take the `path` string given to us by Yup and turn it into an object. Example:
      // `foo.bar` -> {foo: {bar: `[error msg]`}}
      errors.forEach((error) => {
        const path = error.path?.split(`.`)
        let pathEntries: ValidationErrorObj<any> | string[] = error.errors

        if (!path) {
          pathEntries = {root: pathEntries}
          return
        }
        const len = path.length
        for (let i = 0; i < len; i++) {
          pathEntries = {[path[path.length - 1]]: pathEntries}
          path.pop()
        }

        // Combine the paths of all the errors into one object representing all the errors that occured in the form
        // submission
        errorObj = {...errorObj, ...(pathEntries as ValidationErrorObj<T>)}
      })

      throw new ValidationError(errorObj)
    } else {
      throw err
    }
  }
}

export type ValidationErrorObj<Obj> = {
  [Name in keyof Obj]?: Obj[Name] extends {[key: string]: any} ? ValidationErrorObj<Obj[Name]> : string[]
} & {root?: string[]}

// The way this error class is being used in the `validate` function, validation errors that happen at the root level
// will have their messages placed in a property called "root". This means that forms using this class must not have any
// fields named "root" or else they will risk the chance of having their error messages collide.
export class ValidationError<Obj> {
  constructor(public errorObj: ValidationErrorObj<Obj>) {}
}
