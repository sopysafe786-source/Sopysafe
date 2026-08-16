import { PageTemplate } from '@/components/page-template'
import { pageContent } from '@/lib/page-content'

export default function ShippingPolicyPage() {
  const content = pageContent.shipping
  return (
    <PageTemplate
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      sections={content.sections}
    />
  )
}
