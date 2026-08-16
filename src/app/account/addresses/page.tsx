import { PageTemplate } from '@/components/page-template'

export default function AddressesPage() {
  return (
    <PageTemplate
      eyebrow="Addresses"
      title="Delivery addresses with validation and default selection."
      description="A good address manager reduces delivery mistakes and checkout friction."
      sections={[
        { title: 'Saved locations', body: 'Show home, office, and gifting addresses with clear labels.' },
        { title: 'Validation', body: 'Validate PIN code, city, and state combinations before order submission.' },
      ]}
    />
  )
}
