import { PageTemplate } from '@/components/page-template'

export default function ProfilePage() {
  return (
    <PageTemplate
      eyebrow="My Profile"
      title="Your SopySafe profile at a glance."
      description="Manage personal details, delivery info, security preferences, and order shortcuts from one polished account hub."
      sections={[
        {
          title: 'Personal information',
          body: 'Name, email, phone, and login methods stay grouped together so editing remains quick and predictable.',
        },
        {
          title: 'Security and access',
          body: 'Account sessions, password reset, and OTP login support should be easy to review and change.',
        },
        {
          title: 'Preferences',
          body: 'Wishlist alerts, order notifications, and promotional consent can all be adjusted independently.',
        },
      ]}
      stats={[
        { label: 'Customer tier', value: 'Prime member' },
        { label: 'Saved addresses', value: '3' },
        { label: 'Wishlist items', value: '12' },
      ]}
      ctaHref="/orders"
      ctaLabel="View Orders"
    />
  )
}
