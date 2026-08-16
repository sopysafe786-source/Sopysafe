import { PageTemplate } from '@/components/page-template'
import { pageContent } from '@/lib/page-content'

export default function RefundPolicyPage() {
  const content = pageContent.refund
  return (
    <PageTemplate
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      sections={content.sections}
    />
  )
}
