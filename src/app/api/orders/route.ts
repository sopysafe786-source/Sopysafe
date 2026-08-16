import { createOrder, deleteOrders, getOrder, listOrders, updateOrder } from '@/server/storage/order-store'
import type { OrderCreateInput, OrderUpdateInput } from '@/lib/order-types'

function parseJsonBody<T>(request: Request) {
  return request.json().catch(() => null) as Promise<T | null>
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')?.trim()
  const orderNumber = url.searchParams.get('orderNumber')?.trim()
  const status = url.searchParams.get('status')?.trim()

  if (id || orderNumber) {
    const order = getOrder(id ?? orderNumber ?? '')
    if (!order) {
      return Response.json({ message: 'Order not found' }, { status: 404 })
    }

    return Response.json({ order })
  }

  const orders = status ? listOrders().filter((order) => order.status === status) : listOrders()

  return Response.json({
    orders,
    count: orders.length,
  })
}

export async function POST(request: Request) {
  const body = await parseJsonBody<OrderCreateInput>(request)

  if (!body) {
    return Response.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const order = createOrder(body)

    return Response.json(
      {
        order,
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      { status: 201 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create order'
    return Response.json({ message }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  const body = await parseJsonBody<
    OrderUpdateInput & {
      id?: string
      orderNumber?: string
    }
  >(request)

  if (!body) {
    return Response.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const key = (body.id ?? body.orderNumber ?? '').trim()
  if (!key) {
    return Response.json({ message: 'Order id is required' }, { status: 400 })
  }

  const order = updateOrder(key, body)

  if (!order) {
    return Response.json({ message: 'Order not found' }, { status: 404 })
  }

  return Response.json({ order })
}

export async function DELETE() {
  deleteOrders()
  return Response.json({ cleared: true })
}
