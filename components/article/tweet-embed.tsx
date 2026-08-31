import { getTweet } from "react-tweet/api"
import {
  enrichTweet,
  QuotedTweet,
  TweetBody,
  TweetContainer,
  TweetHeader,
  TweetInReplyTo,
  TweetInfo,
  TweetMedia,
  Tweet
} from "react-tweet"

/**
 * react-tweet's theming API, mapped onto the site's design tokens.
 *
 * Every utility carries `!`, and it is load-bearing: react-tweet ships its
 * theme.css and CSS modules OUTSIDE any cascade layer, while Tailwind emits
 * utilities into `@layer utilities`. Unlayered rules beat layered ones no
 * matter the specificity, so without `!` every one of these silently loses and
 * the card renders in stock X navy. Verified — do not strip them.
 */
const THEME = [
  // Surface
  "[--tweet-container-margin:0]!",
  "[--tweet-bg-color:var(--ds-background-200)]!",
  "[--tweet-bg-color-hover:var(--ds-background-200)]!",
  "[--tweet-quoted-bg-color-hover:transparent]!",
  "[--tweet-border:1px_solid_var(--ds-gray-alpha-400)]!",
  // Type
  "[--tweet-font-family:var(--font-sans)]!",
  "[--tweet-font-color:var(--ds-gray-1000)]!",
  "[--tweet-font-color-secondary:var(--ds-gray-900)]!",
  "[--tweet-body-font-size:1rem]!",
  "[--tweet-body-line-height:1.5rem]!",
  "[--tweet-header-font-size:0.875rem]!",
  "[--tweet-header-line-height:1.25rem]!",
  "[--tweet-info-font-size:0.8125rem]!",
  "[--tweet-info-line-height:1.25rem]!",
  // Accents onto the gray ramp
  "[--tweet-color-blue-primary:var(--ds-gray-1000)]!",
  "[--tweet-color-blue-primary-hover:var(--ds-gray-900)]!",
  "[--tweet-color-blue-secondary:var(--ds-gray-1000)]!",
  "[--tweet-color-blue-secondary-hover:var(--ds-gray-alpha-200)]!",
  "[--tweet-twitter-icon-color:var(--ds-gray-900)]!",
  "[--tweet-verified-blue-color:var(--ds-gray-900)]!",
  "[--tweet-verified-old-color:var(--ds-gray-900)]!",
  // Box
  "rounded-lg!",
  "max-w-full!",
  "@min-[40rem]:max-w-[75%]!",
].join(" ")

/**
 * Embedded X post, rendered on the server from the syndication API — no
 * third-party widget script on the client, and it is in the prerendered HTML.
 *
 * Composed from react-tweet's primitives rather than its default <Tweet> so the
 * feed chrome (like/reply/copy-link bar, "read replies" button) can be left
 * out; what remains is retinted to the site's tokens by THEME below.
 *
 * Wrapped in a <figure> so it picks up the typeset flow margin the same way an
 * image or blockquote does.
 */
export async function TweetEmbed({ id }: { id: string }) {
  const raw = await getTweet(id).catch(() => undefined)
  if (!raw) return null

  const tweet = enrichTweet(raw)

  return (
    <figure className="tweet-embed @container flex items-center justify-center">
      <TweetContainer className={THEME}>
        <TweetHeader tweet={tweet} />
        {tweet.in_reply_to_status_id_str && <TweetInReplyTo tweet={tweet} />}
        <TweetBody tweet={tweet} />
        {tweet.mediaDetails?.length ? <TweetMedia tweet={tweet} /> : null}
        {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
        <TweetInfo tweet={tweet} />
      </TweetContainer>
    </figure>
  )
}
