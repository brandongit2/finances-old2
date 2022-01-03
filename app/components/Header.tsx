import type {FC} from "react"

import Button from "~/components/atoms/Button"
import Logo from "~/components/Logo"

const Header: FC = () => {
  return (
    <header className="flex justify-between items-center h-20 px-6 py-4">
      <Logo className="h-10 select-none" />
      <div>
        <form method="post" action="/sign-out">
          <Button type="submit">Sign out</Button>
        </form>
      </div>
    </header>
  )
}

export default Header
