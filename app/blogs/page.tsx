import type { Metadata } from "next"

import { ListPage } from "@/components/article/list-page"

export const metadata: Metadata = {
  title: "Blogs",
  description: "Writing on software, product, and the things in between.",
}

export default function BlogsPage() {
  return (
    <ListPage
      type="blog"
      title="Writing on software, product,"
      subtitle="and the things in between"
    />
  )
}
