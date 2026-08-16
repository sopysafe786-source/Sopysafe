import { PageChrome } from '@/components/site-shell'
import { CheckoutStudio } from '@/components/checkout-studio'

export default function CheckoutPage() {
  return (
    <>
      <PageChrome
        eyebrow="Checkout"
        title="Fast checkout with Indian payment support."
        description="A clean order review flow that keeps the customer moving."
      />
      <CheckoutStudio />
    </>
  )
}
