import {Form, useActionData} from "remix"
import * as yup from "yup"

import type {FC} from "react"

import Button from "~/components/atoms/Button"
import Card from "~/components/atoms/Card"
import Heading from "~/components/atoms/Heading"
import Hr from "~/components/atoms/Hr"
import Label from "~/components/atoms/Label"
import TextInput from "~/components/atoms/TextInput"
import FormError from "~/components/FormError"
import type {YupShape} from "~/types/YupShape"
import type {ValidationErrorObj} from "~/util/validation"
import {email, password} from "~/util/validation"

export type TSignIn = {
  email: string
  password: string
}

export const signInSchema = yup.object().shape<YupShape<TSignIn>>({
  email: email.required(),
  password: password.required(),
})

const SignInForm: FC = () => {
  const errors = useActionData<ValidationErrorObj<TSignIn>>()

  return (
    <Card className="flex flex-col gap-4 max-w-md">
      <Heading lvl={1} className="text-center">
        Sign in
      </Heading>
      <p className="text-sm text-olive-11">
        As this is a beta product, signup is disabled for now. Sign-in credentials are currently being given by invite
        only.
      </p>

      <Hr />

      <Form method="post" replace className="grid grid-cols-[auto_1fr] items-center gap-4" noValidate>
        <FormError className="col-span-2">{errors?.root}</FormError>

        <Label className="text-right">Email</Label>
        <TextInput type="email" name="email" />
        <FormError className="col-start-2 -mt-3.5">{errors?.email}</FormError>

        <Label className="text-right">Password</Label>
        <TextInput type="password" name="password" />
        <FormError className="col-start-2 -mt-3.5">{errors?.password}</FormError>

        <Button type="submit" filled className="col-start-2 mx-auto">
          Submit
        </Button>
      </Form>
    </Card>
  )
}

export default SignInForm
