"use client"

import { useState } from "react"
import { IconColorPicker } from "@tabler/icons-react"
import { HexColorPicker } from "react-colorful"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

// Chromium's screen sampler. Not in TypeScript's DOM lib yet.
declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> }
  }
}

// react-colorful injects its own stylesheet unlayered, which outranks
// Tailwind's utilities layer whatever the specificity, hence the `!`s. These
// restyle its parts onto ziiz: a squircle area with a hairline, a pill hue
// track, and thumbs like the Slider's (outlined, halo on hover and focus).
// In an arbitrary variant `_` means a space, so the BEM underscores are
// escaped, and String.raw keeps the backslashes for Tailwind's scanner and
// the class names alike.
const SKIN = cn(
  String.raw`[&_.react-colorful]:h-auto! [&_.react-colorful]:w-full! [&_.react-colorful]:gap-3`,
  String.raw`[&_.react-colorful\_\_saturation]:h-40! [&_.react-colorful\_\_saturation]:flex-none! [&_.react-colorful\_\_saturation]:rounded-md! [&_.react-colorful\_\_saturation]:border-b-0! [&_.react-colorful\_\_saturation]:shadow-none! [&_.react-colorful\_\_saturation]:ring-1 [&_.react-colorful\_\_saturation]:ring-gray-alpha-400 [&_.react-colorful\_\_saturation]:ring-inset`,
  String.raw`[&_.react-colorful\_\_hue]:h-3! [&_.react-colorful\_\_hue]:flex-none! [&_.react-colorful\_\_hue]:rounded-full!`,
  String.raw`[&_.react-colorful\_\_pointer]:size-4! [&_.react-colorful\_\_pointer]:rounded-full! [&_.react-colorful\_\_pointer]:border-2! [&_.react-colorful\_\_pointer]:border-white! [&_.react-colorful\_\_pointer]:shadow-none! [&_.react-colorful\_\_pointer]:ring-1 [&_.react-colorful\_\_pointer]:ring-black/30 [&_.react-colorful\_\_pointer]:transition-[box-shadow] [&_.react-colorful\_\_pointer-fill]:rounded-full!`,
  String.raw`[&_.react-colorful\_\_interactive:hover_.react-colorful\_\_pointer]:ring-4 [&_.react-colorful\_\_interactive:hover_.react-colorful\_\_pointer]:ring-gray-600/50`,
  String.raw`[&_.react-colorful\_\_interactive:focus_.react-colorful\_\_pointer]:scale-100! [&_.react-colorful\_\_interactive:focus-visible_.react-colorful\_\_pointer]:ring-4 [&_.react-colorful\_\_interactive:focus-visible_.react-colorful\_\_pointer]:ring-gray-600/50`
)

/**
 * A colour picker drawn on the page instead of the browser's: saturation and
 * value as an area, hue as a strip, and the hex as a field you can type or
 * paste into. Where the browser can sample the screen there's an eyedropper.
 */
export function ColorPicker({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (hex: string) => void
  label: string
}) {
  // What's being typed, until it parses as a colour or the field blurs.
  const [draft, setDraft] = useState<string | null>(null)
  const canSample = typeof window !== "undefined" && !!window.EyeDropper

  const sample = async () => {
    try {
      const { sRGBHex } = await new window.EyeDropper!().open()
      onChange(sRGBHex.toLowerCase())
    } catch {
      // Escape cancels the sampler, which rejects: nothing to do.
    }
  }

  return (
    <div className={cn("flex flex-col gap-3", SKIN)}>
      <HexColorPicker color={value} onChange={onChange} />
      <InputGroup size="sm" variant="secondary">
        <InputGroupAddon>
          <InputGroupText className="text-label-13-mono">#</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label={`${label} hex`}
          value={draft ?? value.slice(1).toUpperCase()}
          spellCheck={false}
          maxLength={7}
          onChange={(e) => {
            const next = e.target.value.replace("#", "")
            setDraft(next)
            if (/^[0-9a-f]{6}$/i.test(next)) onChange(`#${next.toLowerCase()}`)
          }}
          onBlur={() => setDraft(null)}
          className="text-label-13-mono md:text-label-13-mono"
        />
        {canSample ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Pick a colour from the screen"
              onClick={sample}
            >
              <IconColorPicker />
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </div>
  )
}
