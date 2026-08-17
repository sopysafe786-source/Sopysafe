import crypto from 'node:crypto'
import type { OrderCreateInput, OrderLine, OrderRecord, OrderStatus, OrderUpdateInput } from '@/lib/order-types'
import {
  createOrder as createLocalOrder,
  deleteOrders as deleteLocalOrders,
  getOrder as getLocalOrder,
  listOrders as listLocalOrders,
  listOrdersByStatus as listLocalOrdersByStatus,
  updateOrder as updateLocalOrder,
} from '@/lib/order-store'
import { isMySqlConfigured } from '@/server/db/mysql'
import { deleteMySqlState, readMySqlState, writeMySqlState } from '@/server/db/mysql-state'

type OrdersState = {
  orders: OrderRecord[]
}

const ORDERS_STATE_KEY = 'orders_state'

function createDefaultState(): OrdersState {
  return { orders: [] }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function roundCurrency(value: number) {
  return Number(value.toFixed(2))
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

function normalizeCustomer(customer: OrderCreateInput['customer']) {
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

function createOrderNumber() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase()
  return `SS-${stamp}-${suffix}`
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

async function loadState() {
  return readMySqlState<OrdersState>(ORDERS_STATE_KEY, createDefaultState())
}

async function saveState(state: OrdersState) {
  return writeMySqlState(ORDERS_STATE_KEY, state)
}

export async function listOrderRecords() {
  if (!isMySqlConfigured()) {
    return listLocalOrders()
  }

  const state = await loadState()
  return [...state.orders].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  )
}

export async function findOrderRecord(idOrNumber: string) {
  if (!isMySqlConfigured()) {
    return getLocalOrder(idOrNumber)
  }

  const key = idOrNumber.trim()
  const state = await loadState()
  return state.orders.find((order) => order.id === key || order.orderNumber === key) ?? null
}

export async function createOrderRecord(input: OrderCreateInput) {
  if (!isMySqlConfigured()) {
    return createLocalOrder(input)
  }

  const items = normalizeItems(input.items)
  const customer = normalizeCustomer(input.customer)
  const total = isFiniteNumber(input.total)
    ? roundCurrency(input.total)
    : roundCurrency(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const now = new Date().toISOString()

  const order: OrderRecord = normalizeOrder({
    id: String(input.id ?? crypto.randomUUID()).trim(),
    orderNumber: createOrderNumber(),
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
  })

  const state = await loadState()
  state.orders = [order, ...state.orders.filter((item) => item.id !== order.id)]
  await saveState(state)
  return order
}

export async function updateOrderRecord(idOrNumber: string, patch: OrderUpdateInput) {
  if (!isMySqlConfigured()) {
    return updateLocalOrder(idOrNumber, patch)
  }

  const state = await loadState()
  const targetIndex = state.orders.findIndex(
    (order) => order.id === idOrNumber || order.orderNumber === idOrNumber,
  )

  if (targetIndex < 0) {
    return null
  }

  const current = state.orders[targetIndex]
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

  state.orders[targetIndex] = nextOrder
  await saveState(state)
  return nextOrder
}

export async function deleteOrderRecords() {
  if (!isMySqlConfigured()) {
    deleteLocalOrders()
    return
  }

  await deleteMySqlState(ORDERS_STATE_KEY)
}

export async function listOrdersForStatus(status: OrderStatus) {
  if (!isMySqlConfigured()) {
    return listLocalOrdersByStatus(status)
  }

  const orders = await listOrderRecords()
  return orders.filter((order) => order.status === status)
}

