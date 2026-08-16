import { PageTemplate } from '@/components/page-template'
import { pageContent } from '@/lib/page-content'

export default function BlogPage() {
  const content = pageContent.blog
  return (
    <PageTemplate
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      sections={content.sections}
    />
  )
}
