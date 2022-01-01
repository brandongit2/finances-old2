import type {FC} from "react"

import Button from "~/components/atoms/Button"

const Header: FC = () => {
  return (
    <header className="bg-olive-1 flex justify-between items-center">
      <img src="/logo.svg" className="h-12" />
      <div>
        <Button>Sign out</Button>
      </div>
    </header>
  )
}

export default Header
