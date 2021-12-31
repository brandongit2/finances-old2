import * as RadixDialog from "@radix-ui/react-dialog"
import {createContext, useContext, useState} from "react"

import type {FC, ReactNode} from "react"

type DialogState = {
  content: ReactNode
  options: {}
}

type TDialogContext = {
  state: DialogState
  dispatch: React.Dispatch<React.SetStateAction<DialogState>>
}

const DialogContext = createContext<TDialogContext | undefined>(undefined)

const Dialog: FC = () => {
  const dialogContent = useDialogContent()

  return (
    <RadixDialog.Root>
      <RadixDialog.Dialog>{dialogContent}</RadixDialog.Dialog>
    </RadixDialog.Root>
  )
}

export const DialogProvider: FC = ({children}) => {
  const [state, dispatch] = useState<DialogState>({content: null, options: {}})
  return (
    <DialogContext.Provider value={{state, dispatch}}>
      <Dialog />
      {children}
    </DialogContext.Provider>
  )
}

export function useDialogContent() {
  const context = useContext(DialogContext)
  if (!context) throw new Error(`\`useDialogContent\` must be used inside a \`DialogProvider\`.`)

  return context.state.content
}

export function useSetDialog(content: DialogState[`content`]) {
  const context = useContext(DialogContext)
  if (!context) throw new Error(`\`useSetDialog\` must be used inside a \`DialogProvider\`.`)

  context.dispatch(({options}) => ({content, options}))
}
