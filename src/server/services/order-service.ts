import type { OrderCreateInput, OrderStatus, OrderUpdateInput } from '@/lib/order-types'
import {
  createOrder as createOrderStore,
  deleteOrders as deleteOrderStore,
  getOrder as getOrderStore,
  listOrders as listOrderStore,
  listOrdersByStatus as listOrdersByStatusStore,
  updateOrder as updateOrderStore,
} from '@/lib/order-store'

export async function listOrderRecords() {
  return listOrderStore()
}

export async function findOrderRecord(idOrNumber: string) {
  return getOrderStore(idOrNumber)
}

export async function createOrderRecord(input: OrderCreateInput) {
  return createOrderStore(input)
}

export async function updateOrderRecord(idOrNumber: string, patch: OrderUpdateInput) {
  return updateOrderStore(idOrNumber, patch)
}

export async function deleteOrderRecords() {
  return deleteOrderStore()
}

export async function listOrdersForStatus(status: OrderStatus) {
  return listOrdersByStatusStore(status)
}
