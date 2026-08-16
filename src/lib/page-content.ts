import { siteName, siteTagline } from '@/lib/site'

export type PageContent = {
  eyebrow: string
  title: string
  description: string
  sections: Array<{ title: string; body: string }>
  stats?: Array<{ label: string; value: string }>
}

export const pageContent: Record<string, PageContent> = {
  about: {
    eyebrow: 'Our Story',
    title: `${siteName} builds trust into every shopping moment.`,
    description:
      'We are creating an Indian e-commerce experience that feels calm, premium, and dependable from discovery to delivery.',
    sections: [
      {
        title: 'Brand promise',
        body:
          'Every interaction is designed to reduce friction: clearer product discovery, straightforward pricing, secure checkout, and transparent support.',
      },
      {
        title: 'Why we exist',
        body:
          `Shoppers should not have to choose between premium feel and practical confidence. ${siteTagline} is our compact promise that both can coexist.`,
      },
    ],
    stats: [
      { label: 'Fulfillment stance', value: 'India first' },
      { label: 'Design approach', value: 'Luxury minimalism' },
      { label: 'Operational focus', value: 'Trust and speed' },
    ],
  },
  contact: {
    eyebrow: 'Talk To Us',
    title: 'Support that feels human, fast, and accountable.',
    description:
      'Reach us for pre-purchase questions, post-order support, partnership requests, and catalog onboarding.',
    sections: [
      {
        title: 'Customer care',
        body:
          'We recommend dedicated WhatsApp, email, and live-chat entry points for quick issue resolution and order confidence.',
      },
      {
        title: 'Business enquiries',
        body:
          'For brands and logistics partners, the platform is set up to support structured onboarding, SLAs, and reporting.',
      },
    ],
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Answers that help customers decide faster.',
    description:
      'This FAQ is written to reduce uncertainty around delivery, payments, returns, and account handling.',
    sections: [
      {
        title: 'Payments and orders',
        body:
          'The platform is designed around Razorpay and UPI-first customer flows with a provider abstraction for future integrations.',
      },
      {
        title: 'Returns and refunds',
        body:
          'Return windows, pickup rules, and refund timing should be shown clearly before checkout and inside order details.',
      },
    ],
  },
  blog: {
    eyebrow: 'Insights',
    title: 'Commerce stories, buying guides, and brand notes.',
    description:
      'Use the blog to improve SEO, educate customers, and support category discovery with useful content.',
    sections: [
      {
        title: 'Editorial strategy',
        body:
          'Publish buying guides, seasonal trend notes, setup tips, and product care advice aligned with your search goals.',
      },
      {
        title: 'Trust content',
        body:
          'Explain materials, sourcing, warranty coverage, shipping expectations, and service policies with clear language.',
      },
    ],
  },
  privacy: {
    eyebrow: 'Policy',
    title: 'Privacy built for modern commerce.',
    description:
      'Customer data should be collected minimally, secured carefully, and used only for delivering a better shopping experience.',
    sections: [
      { title: 'Data minimization', body: 'Collect only the information you need to complete orders and support customers.' },
      { title: 'Access control', body: 'Restrict internal access to role-based permissions, audit trails, and least privilege.' },
    ],
  },
  refund: {
    eyebrow: 'Policy',
    title: 'Refunds that are predictable and fair.',
    description:
      'Customers should know exactly how refund timing, eligibility, and reversal paths work before they buy.',
    sections: [
      { title: 'Eligibility', body: 'Define condition checks, return windows, and non-returnable categories clearly.' },
      { title: 'Timelines', body: 'Display payment reversal windows by provider so expectations stay accurate.' },
    ],
  },
  shipping: {
    eyebrow: 'Policy',
    title: 'Shipping expectations customers can trust.',
    description:
      'Clear dispatch promises and delivery estimates help improve conversion and reduce support load.',
    sections: [
      { title: 'Estimates', body: 'Show city-level estimates, courier milestones, and delays when inventory changes.' },
      { title: 'Tracking', body: 'Expose trackable stages from packed to out for delivery to delivered.' },
    ],
  },
  return: {
    eyebrow: 'Policy',
    title: 'Returns designed for confidence.',
    description:
      'Return instructions must be easy to find, quick to understand, and consistent across channels.',
    sections: [
      { title: 'Pickup flow', body: 'Use a clear pickup request flow with status notifications and next-step guidance.' },
      { title: 'Inspection', body: 'When items arrive back, communicate inspection status before refund release.' },
    ],
  },
  terms: {
    eyebrow: 'Policy',
    title: 'Terms that keep the marketplace fair.',
    description:
      'Terms should outline usage, pricing, liability, moderation, and dispute handling without legal fog.',
    sections: [
      { title: 'Usage rules', body: 'Describe acceptable account behavior and content standards in concise language.' },
      { title: 'Liability', body: 'Set expectations for service availability, force majeure, and third-party integrations.' },
    ],
  },
  login: {
    eyebrow: 'Access',
    title: 'Sign in with confidence.',
    description:
      'Authentication is designed for email, phone OTP, and Google sign-in with secure session handling.',
    sections: [
      { title: 'Passwordless-ready', body: 'Phone OTP and email link flows reduce friction for returning customers.' },
      { title: 'Account safety', body: 'Use CSRF protection, secure cookies, and device-aware session controls.' },
    ],
  },
  register: {
    eyebrow: 'Access',
    title: 'Create your SopySafe account.',
    description:
      'Registration should be quick, accessible, and designed to help customers start shopping immediately.',
    sections: [
      { title: 'Fast onboarding', body: 'Collect only the fields needed to complete signup and first-order completion.' },
      { title: 'Convenience', body: 'Support Google login and OTP verification to reduce password fatigue.' },
    ],
  },
  forgot: {
    eyebrow: 'Access',
    title: 'Reset access without friction.',
    description:
      'Password recovery should be simple, secure, and easy to complete on mobile devices.',
    sections: [
      { title: 'Secure reset', body: 'Use time-bound links or OTP verification before allowing credential updates.' },
      { title: 'Recovery guidance', body: 'Show clear instructions for checking spam, SMS delivery, and expiration windows.' },
    ],
  },
}
