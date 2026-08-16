import { PageTemplate } from '@/components/page-template'
import { pageContent } from '@/lib/page-content'

export default function ContactPage() {
  const content = pageContent.contact
  return (
    <PageTemplate
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      sections={content.sections}
      ctaHref="/faq"
      ctaLabel="Read FAQ"
    />
  )
}
