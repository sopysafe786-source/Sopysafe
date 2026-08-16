import { PageTemplate } from '@/components/page-template'

export default function NotificationsPage() {
  return (
    <PageTemplate
      eyebrow="Notifications"
      title="Notification preferences that stay respectful."
      description="Users should control order updates, promos, reminders, and support messages separately."
      sections={[
        { title: 'Operational alerts', body: 'Order and delivery updates should be prioritized above marketing messages.' },
        { title: 'Marketing consent', body: 'Promotions should be opt-in, logged, and easy to unsubscribe from.' },
      ]}
    />
  )
}
