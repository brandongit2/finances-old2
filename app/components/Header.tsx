import type {FC} from "react"

import Button from "~/components/atoms/Button"

const Header: FC = () => {
  return (
    <header className="bg-olive-1">
      <span>Finances</span>
      <div>
        <Button>Sign in</Button>
        <Button>Sign up</Button>
      </div>
    </header>
  )
}

export default Header
