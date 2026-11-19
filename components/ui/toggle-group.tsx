"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }
>({
  size: "default",
  variant: "default",
  shape: "default",
  spacing: 2,
  orientation: "horizontal",
})

function ToggleGroup({
  className,
  variant,
  size,
  shape,
  spacing = 2,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
    orientation?: "horizontal" | "vertical"
  }) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-spacing={spacing}
      data-orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-md data-[shape=rounded]:rounded-full data-vertical:flex-col data-vertical:items-stretch",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, shape, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  shape = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:px-2.5 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:active:scale-100 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pe-2 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:ps-2 group-data-horizontal/toggle-group:data-[spacing=0]:not-first:rounded-s-none group-data-horizontal/toggle-group:data-[spacing=0]:not-last:rounded-e-none group-data-vertical/toggle-group:data-[spacing=0]:not-first:rounded-t-none group-data-vertical/toggle-group:data-[spacing=0]:not-last:rounded-b-none group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:not-first:border-s-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:not-first:border-t-0",
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
          shape: context.shape || shape,
        }),
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
