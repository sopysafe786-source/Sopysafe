import { AdminStudio } from '@/components/admin-studio'
import { PageChrome } from '@/components/site-shell'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return (
    <>
      <PageChrome
        eyebrow="Dashboard"
        title="SopySafe business control center."
        description="Manage products, orders, customers, media, and site content from one place."
      />
      <AdminStudio />
    </>
  )
}
