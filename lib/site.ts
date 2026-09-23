export const site = {
  name: "Nafis Riza",
  url: "https://nafisazizir.com",
  description:
    "Software engineer - building at the intersection of AI and developer tooling.",
  email: "hello@nafisazizir.com",
  github: "https://github.com/nafisazizir",
  twitter: "https://x.com/nafisazizir",
  twitterHandle: "@nafisazizir",
  linkedin: "https://www.linkedin.com/in/nafisazizir",
} as const

export const socialLinks = [
  { href: site.github, label: "GitHub" },
  { href: site.linkedin, label: "LinkedIn" },
  { href: site.twitter, label: "X / Twitter" },
  { href: `mailto:${site.email}`, label: "Email" },
] as const
