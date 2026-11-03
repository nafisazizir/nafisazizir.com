/** Adam's contact picture: his white blob with the asterisk eyes, on black. */
export function AdamAvatar({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/articles/raising-adam/adam.png"
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full bg-black object-cover"
      style={{ width: size, height: size }}
    />
  )
}
