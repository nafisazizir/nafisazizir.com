"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useGlide } from "@/hooks/use-glide"
import { inputVariants } from "@/components/ui/input"
import {
  IconSelector,
  IconCheck,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react"

type Size = "sm" | "default" | "lg"
type Look = VariantProps<typeof inputVariants>

const SizeContext = React.createContext<Size>("default")
const LookContext = React.createContext<Look>({})

function Select<Value, Multiple extends boolean | undefined = false>({
  size = "default",
  variant,
  shape,
  ...props
}: SelectPrimitive.Root.Props<Value, Multiple> & Look & { size?: Size }) {
  const look = React.useMemo(() => ({ variant, shape }), [variant, shape])
  return (
    <SizeContext.Provider value={size}>
      <LookContext.Provider value={look}>
        <SelectPrimitive.Root data-slot="select" {...props} />
      </LookContext.Provider>
    </SizeContext.Provider>
  )
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size,
  variant,
  shape,
  children,
  ...props
}: SelectPrimitive.Trigger.Props &
  Look & {
    size?: Size
  }) {
  const inherited = React.useContext(SizeContext)
  const look = React.useContext(LookContext)
  size ??= inherited
  variant ??= look.variant
  shape ??= look.shape
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-md border py-2 ps-3 pe-2.5 text-label-14 whitespace-nowrap transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-800 aria-invalid:bg-red-100 data-placeholder:text-gray-900 data-[size=default]:h-9 data-[size=lg]:h-10 data-[size=lg]:ps-4 data-[size=lg]:pe-3.5 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        inputVariants({ variant, shape }),
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <IconSelector className="pointer-events-none size-4 text-gray-900" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  const glide = useGlide("[role=option][data-highlighted]")
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-size={React.useContext(SizeContext)}
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto material-menu border border-transparent text-gray-1000 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List className="relative isolate p-1">
            {children}
            <span
              ref={glide}
              aria-hidden
              data-hidden=""
              data-slot="select-highlight"
              className="pointer-events-none absolute top-0 left-0 -z-1 bg-gray-alpha-100 transition-[translate,width,height,opacity,background-color] duration-150 ease-out data-hidden:opacity-0 data-hidden:delay-50 data-pressed:bg-gray-alpha-200 data-[variant=destructive]:bg-red-100 data-[variant=destructive]:data-pressed:bg-red-200 motion-reduce:transition-[opacity]"
            />
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-label-12 text-gray-900 in-data-[size=lg]:px-3",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-label-14 outline-hidden select-none focus:text-gray-1000 not-data-[variant=destructive]:focus:**:text-gray-1000 in-data-[size=lg]:py-2 in-data-[size=lg]:ps-3 in-data-[size=lg]:pe-9 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute end-2 flex size-4 items-center justify-center in-data-[size=lg]:end-3" />
        }
      >
        <IconCheck className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-gray-alpha-400",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-background-100 py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconChevronUp />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-background-100 py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconChevronDown />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
