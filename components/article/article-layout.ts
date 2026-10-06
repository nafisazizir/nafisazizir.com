// The boxes an article is built from, shared by the page and its skeleton so
// the loading state occupies exactly the space the post will. Kept out of the
// client modules: a value exported from a "use client" file reaches a server
// component as a reference, not a string.

/**
 * From lg a two-column grid: the way back on the first row, the title and date
 * on the second, the art spanning both (400x244, top-aligned). The second row
 * takes whatever the art leaves, so the title and date sit on the art's bottom
 * edge. Below lg it stacks, the art under the date at 2:1.
 */
export const HEADER =
  "grid grid-cols-1 border-b border-gray-alpha-400 pb-6 lg:grid-cols-[minmax(0,45rem)_25rem] lg:grid-rows-[auto_1fr] lg:justify-between lg:gap-x-4 lg:pb-30"

export const HEADER_BACK =
  "flex min-w-0 items-center gap-4 lg:col-start-1 lg:row-start-1"

export const HEADER_HEADLINE =
  "flex min-w-0 flex-col justify-end gap-4 pt-6 lg:col-start-1 lg:row-start-2 lg:pt-8"

export const HEADER_TITLE =
  "text-heading-32 sm:text-heading-40 lg:text-heading-48"

export const HEADER_DATE = "text-label-13"

export const HEADER_ART =
  "relative mt-6 aspect-2/1 w-full overflow-hidden lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:aspect-auto lg:h-61 lg:w-100 lg:self-start"

export const BODY = "typeset mx-auto w-full max-w-180 pt-12"
