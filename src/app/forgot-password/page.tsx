import { PageTemplate } from '@/components/page-template'
import { pageContent } from '@/lib/page-content'

export default function ForgotPasswordPage() {
  const content = pageContent.forgot
  return (
    <PageTemplate
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      sections={content.sections}
      ctaHref="/login"
      ctaLabel="Back to Login"
    />
  )
}
