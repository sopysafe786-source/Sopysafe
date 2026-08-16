import { PageTemplate } from '@/components/page-template'
import { pageContent } from '@/lib/page-content'

export default function FaqPage() {
  const content = pageContent.faq
  return (
    <PageTemplate
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      sections={content.sections}
      ctaHref="/contact"
      ctaLabel="Contact Support"
    />
  )
}
