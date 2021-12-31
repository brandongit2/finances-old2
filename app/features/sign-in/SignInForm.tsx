import {Form} from "remix"
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
import {useValidation} from "~/util/useValidation"
import {email} from "~/util/validation"

export type TSignIn = {
  email: string
  password: string
}

export const signInSchema = yup.object().shape<YupShape<TSignIn>>({
  email: email.required(),

  // Don't use the `password` const from ~/util/validation because we're not creating any passwords here.
  password: yup.string().max(500).required(),
})

const SignInForm: FC = () => {
  const {validate, errors} = useValidation<TSignIn>(signInSchema)

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

      <Form method="post" replace className="grid grid-cols-[auto_1fr] items-center gap-x-4" noValidate>
        <FormError messages={errors.root} className="col-span-2" marginBottom />

        <Label className="text-right">Email</Label>
        <TextInput type="email" name="email" {...validate(`email`)} />
        <FormError messages={errors.email} className="col-start-2" />

        <div className="h-4 col-span-2" />

        <Label className="text-right">Password</Label>
        <TextInput type="password" name="password" {...validate(`password`)} />
        <FormError className="col-start-2">{errors.password}</FormError>

        <div className="h-4 col-span-2" />

        <Button type="submit" filled className="col-start-2 mx-auto">
          Submit
        </Button>
      </Form>
    </Card>
  )
}

export default SignInForm
