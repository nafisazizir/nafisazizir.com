import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { inputVariants } from "@/components/ui/input"
import { IconSelector } from "@tabler/icons-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> &
  VariantProps<typeof inputVariants> & {
    size?: "sm" | "default" | "lg"
  }

function NativeSelect({
  className,
  size = "default",
  variant = "default",
  shape = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          "h-9 w-full min-w-0 appearance-none rounded-md border py-1 ps-3 pe-8 text-label-14 transition-[color,background-color,border-color,box-shadow] outline-none select-none selection:bg-gray-1000 selection:text-background-100 placeholder:text-gray-900 focus-visible:border-gray-600 focus-visible:ring-3 focus-visible:ring-gray-600/50 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-red-800 aria-invalid:bg-red-100 data-[size=lg]:h-10 data-[size=lg]:ps-4 data-[size=lg]:pe-9.5 data-[size=sm]:h-8",
          inputVariants({ variant, shape })
        )}
        {...props}
      />
      <IconSelector
        className="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-900 select-none group-data-[size=lg]/native-select:end-3.5"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
