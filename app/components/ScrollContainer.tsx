import * as ScrollArea from "@radix-ui/react-scroll-area"
import clsx from "clsx"
import {forwardRef} from "react"

type ScrollContainerProps = {
  permanent?: boolean
  marginStart?: string
  marginEnd?: string
  orientation?: `vertical` | `horizontal` | `both`
}

const ScrollContainer = forwardRef<
  HTMLDivElement,
  ScrollContainerProps & Omit<React.ComponentProps<typeof ScrollArea.Root>, `asChild`>
>(function ScrollContainer(
  {permanent = false, marginStart, marginEnd, orientation = `vertical`, children, className, ...props},
  ref,
) {
  return (
    <ScrollArea.Root {...props} className={clsx(`overflow-hidden`, className)} type="scroll" scrollHideDelay={400}>
      <ScrollArea.Viewport className="max-h-full w-full" ref={ref}>
        {children}
      </ScrollArea.Viewport>

      {(orientation === `vertical` || orientation === `both`) && (
        <ScrollArea.Scrollbar
          forceMount
          orientation="vertical"
          className={clsx(
            `w-3 p-0.5 bg-olive-a-6 increase-touch-target z-10`,
            !permanent && `opacity-0 hover:opacity-100 radix-visible:opacity-100 transition-opacity duration-500`,
          )}
          style={{marginTop: marginStart, marginBottom: marginEnd}}
        >
          <ScrollArea.Thumb
            className="
              rounded-full cursor-pointer bg-olive-a-9 hover:bg-olive-a-11 transition-colors
              relative increase-touch-target
            "
          />
        </ScrollArea.Scrollbar>
      )}

      {(orientation === `horizontal` || orientation === `both`) && (
        <ScrollArea.Scrollbar
          forceMount
          orientation="horizontal"
          className={clsx(
            `h-3 p-0.5 bg-olive-a-6 flex increase-touch-target z-10`,
            !permanent && `opacity-0 hover:opacity-100 radix-visible:opacity-100 transition-opacity duration-500`,
          )}
          style={{marginTop: marginStart, marginBottom: marginEnd}}
        >
          <ScrollArea.Thumb
            className="
              rounded-full cursor-pointer bg-olive-a-9 hover:bg-olive-a-11 transition-colors
              relative increase-touch-target
            "
          />
        </ScrollArea.Scrollbar>
      )}
    </ScrollArea.Root>
  )
})

export default ScrollContainer
