import type {FC} from "react"

import Button from "~/components/atoms/Button"

const Header: FC = () => {
  return (
    <header className="bg-olive-1 flex justify-between items-center px-6 py-4">
      <img src="/logo.svg" className="h-12 select-none" />
      <div>
        <form method="post" action="/sign-out">
          <Button type="submit">Sign out</Button>
        </form>
      </div>
    </header>
  )
}

export default Header
