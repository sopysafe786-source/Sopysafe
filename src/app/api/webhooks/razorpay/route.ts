import { createHmac, timingSafeEqual } from 'node:crypto'
import { getOrder, updateOrder } from '@/server/storage/order-store'
import type { OrderUpdateInput } from '@/lib/order-types'

function verifySignature(body: string, signature: string, secret: string) {
  const digest = createHmac('sha256', secret).update(body).digest('hex')
  const digestBuffer = Buffer.from(digest, 'hex')
  const signatureBuffer = Buffer.from(signature, 'hex')

  if (digestBuffer.length !== signatureBuffer.length) {
    return false
  }

  return timingSafeEqual(digestBuffer, signatureBuffer)
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>
  } catch {
    return null
  }
}

function resolveOrderKey(payload: Record<string, unknown>) {
  const directKeys = ['orderId', 'order_id', 'orderNumber']
  for (const key of directKeys) {
    const value = payload[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  const nestedOrder = payload.payload && typeof payload.payload === 'object'
    ? (payload.payload as Record<string, unknown>).order
    : null

  if (nestedOrder && typeof nestedOrder === 'object') {
    const entity = nestedOrder as Record<string, unknown>
    const nestedValue =
      (typeof entity.id === 'string' && entity.id.trim() && entity.id.trim()) ||
      (typeof entity.order_id === 'string' && entity.order_id.trim() && entity.order_id.trim())

    if (nestedValue) {
      return nestedValue
    }
  }

  return null
}

function resolveUpdate(payload: Record<string, unknown>): OrderUpdateInput {
  const event = typeof payload.event === 'string' ? payload.event : ''
  const payloadRecord =
    payload.payload && typeof payload.payload === 'object'
      ? (payload.payload as Record<string, unknown>)
      : null
  const paymentRecord =
    payloadRecord?.payment && typeof payloadRecord.payment === 'object'
      ? (payloadRecord.payment as Record<string, unknown>)
      : null
  const entity =
    paymentRecord?.entity && typeof paymentRecord.entity === 'object'
      ? (paymentRecord.entity as Record<string, unknown>)
      : null

  if (event.includes('payment.captured') || event.includes('payment.authorized')) {
    return {
      paymentStatus: event.includes('payment.captured') ? 'paid' : 'authorized',
      status: 'Processing',
      providerRef: typeof entity?.id === 'string' ? entity.id : undefined,
      paymentMethod: 'razorpay',
    }
  }

  if (event.includes('payment.failed')) {
    return {
      paymentStatus: 'failed',
      status: 'Cancelled',
      providerRef: typeof entity?.id === 'string' ? entity.id : undefined,
      paymentMethod: 'razorpay',
    }
  }

  return {
    providerRef: typeof entity?.id === 'string' ? entity.id : undefined,
    paymentMethod: 'razorpay',
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const payload = tryParseJson(body)

  if (!payload) {
    return Response.json({ message: 'Invalid webhook payload' }, { status: 400 })
  }

  const signature = request.headers.get('x-razorpay-signature')?.trim()
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim()

  if (secret && signature && !verifySignature(body, signature, secret)) {
    return Response.json({ message: 'Invalid webhook signature' }, { status: 401 })
  }

  const orderKey = resolveOrderKey(payload)
  const update = resolveUpdate(payload)
  const order = orderKey ? updateOrder(orderKey, update) : null

  return Response.json({
    received: true,
    provider: 'razorpay',
    verified: !secret || Boolean(signature),
    orderFound: Boolean(order),
    order: order ?? undefined,
    event: typeof payload.event === 'string' ? payload.event : undefined,
    orderKey,
    updated: Boolean(order),
  })
}

export async function GET() {
  const order = getOrder('non-existent')
  return Response.json({
    provider: 'razorpay',
    ready: true,
    sampleLookup: Boolean(order),
  })
}
