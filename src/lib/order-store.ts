import 'server-only'

import crypto from 'node:crypto'
import type { CustomerInfo, OrderCreateInput, OrderLine, OrderRecord, OrderStatus, OrderUpdateInput } from '@/lib/order-types'
import { deleteMySqlState, readMySqlState, writeMySqlState } from '@/server/db/mysql-state'

type OrderStore = {
  orders: OrderRecord[]
  sequence: number
}

const DEFAULT_SEQUENCE = 1000
const ORDER_STATE_KEY = 'orders_state'

function createDefaultStore(): OrderStore {
  return {
    orders: [],
    sequence: DEFAULT_SEQUENCE,
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function roundCurrency(value: number) {
  return Number(value.toFixed(2))
}

function sumItems(items: OrderLine[]) {
  return roundCurrency(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
}

function normalizeItems(items: OrderLine[]) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error('At least one order item is required')
  }

  return items.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Order item ${index + 1} is invalid`)
    }

    const slug = String(item.slug ?? '').trim()
    const name = String(item.name ?? '').trim()
    const price = Number(item.price)
    const quantity = Number(item.quantity)

    if (!slug || !name) {
      throw new Error(`Order item ${index + 1} must include slug and name`)
    }

    if (!isFiniteNumber(price) || price < 0) {
      throw new Error(`Order item ${index + 1} has an invalid price`)
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Order item ${index + 1} has an invalid quantity`)
    }

    return {
      slug,
      name,
      price: roundCurrency(price),
      quantity,
    }
  })
}

function normalizeCustomer(customer: CustomerInfo) {
  if (!customer || typeof customer !== 'object') {
    throw new Error('Customer details are required')
  }

  const normalized = {
    name: String(customer.name ?? '').trim(),
    phone: String(customer.phone ?? '').trim(),
    email: String(customer.email ?? '').trim(),
    address: String(customer.address ?? '').trim(),
  }

  if (!normalized.name || !normalized.phone || !normalized.email || !normalized.address) {
    throw new Error('Customer details are incomplete')
  }

  return normalized
}

function createOrderNumber(sequence: number) {
  const date = new Date()
  const year = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const serial = String(sequence).padStart(4, '0')
  return `SS-${year}${month}${day}-${serial}`
}

function normalizeOrder(order: Partial<OrderRecord>): OrderRecord {
  return {
    id: String(order.id ?? crypto.randomUUID()).trim(),
    orderNumber: String(order.orderNumber ?? `SS-${Date.now()}`),
    createdAt: order.createdAt ?? new Date().toISOString(),
    updatedAt: order.updatedAt ?? order.createdAt ?? new Date().toISOString(),
    status: order.status ?? 'Placed',
    paymentStatus: order.paymentStatus ?? 'pending',
    total: typeof order.total === 'number' ? roundCurrency(order.total) : 0,
    items: Array.isArray(order.items) ? order.items : [],
    customer:
      order.customer ?? {
        name: '',
        phone: '',
        email: '',
        address: '',
      },
    paymentMethod: order.paymentMethod ?? 'manual',
    provider: order.provider ?? 'storefront',
    providerRef: order.providerRef ?? '',
  }
}

async function loadStore() {
  return readMySqlState<OrderStore>(ORDER_STATE_KEY, createDefaultStore())
}

async function saveStore(store: OrderStore) {
  return writeMySqlState(ORDER_STATE_KEY, store)
}

function normalizeOrderInput(input: OrderCreateInput): Omit<OrderRecord, 'orderNumber' | 'updatedAt'> & {
  updatedAt?: string
} {
  const items = normalizeItems(input.items)
  const customer = normalizeCustomer(input.customer)
  const total = isFiniteNumber(input.total) ? roundCurrency(input.total) : sumItems(items)
  const now = new Date().toISOString()

  return {
    id: String(input.id ?? crypto.randomUUID()).trim(),
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
    status: input.status ?? 'Placed',
    paymentStatus: input.paymentStatus ?? 'pending',
    total,
    items,
    customer,
    paymentMethod: String(input.paymentMethod ?? 'manual'),
    provider: String(input.provider ?? 'storefront'),
    providerRef: String(input.providerRef ?? ''),
  }
}

export async function listOrders() {
  return [...(await loadStore()).orders].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  )
}

export async function getOrder(idOrNumber: string) {
  const key = idOrNumber.trim()
  return (await loadStore()).orders.find((order) => order.id === key || order.orderNumber === key) ?? null
}

export async function createOrder(input: OrderCreateInput) {
  const store = await loadStore()
  const normalized = normalizeOrderInput(input)
  const now = new Date().toISOString()
  const order: OrderRecord = {
    ...normalized,
    orderNumber: createOrderNumber(store.sequence),
    updatedAt: now,
  }

  store.sequence += 1
  store.orders = [order, ...store.orders.filter((item) => item.id !== order.id)]
  await saveStore(store)

  return order
}

export async function updateOrder(idOrNumber: string, patch: OrderUpdateInput) {
  const store = await loadStore()
  const targetIndex = store.orders.findIndex(
    (order) => order.id === idOrNumber || order.orderNumber === idOrNumber,
  )

  if (targetIndex < 0) {
    return null
  }

  const current = store.orders[targetIndex]
  const nextItems = patch.items ? normalizeItems(patch.items) : current.items
  const nextCustomer = patch.customer ? normalizeCustomer(patch.customer) : current.customer

  const nextOrder: OrderRecord = {
    ...current,
    ...patch,
    items: nextItems,
    customer: nextCustomer,
    total: isFiniteNumber(patch.total) ? roundCurrency(patch.total) : current.total,
    updatedAt: new Date().toISOString(),
  }

  store.orders[targetIndex] = nextOrder
  await saveStore(store)
  return nextOrder
}

export async function deleteOrders() {
  const store = await loadStore()
  store.orders = []
  store.sequence = DEFAULT_SEQUENCE
  await saveStore(store)
}

export async function listOrdersByStatus(status: OrderStatus) {
  return (await listOrders()).filter((order) => order.status === status)
}
