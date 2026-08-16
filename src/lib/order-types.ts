export type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

export type OrderPaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded'

export type CustomerInfo = {
  name: string
  phone: string
  email: string
  address: string
}

export type OrderLine = {
  slug: string
  name: string
  price: number
  quantity: number
}

export type OrderRecord = {
  id: string
  orderNumber: string
  createdAt: string
  updatedAt: string
  status: OrderStatus
  paymentStatus: OrderPaymentStatus
  total: number
  items: OrderLine[]
  customer: CustomerInfo
  paymentMethod: string
  provider: string
  providerRef: string
}

export type OrderCreateInput = {
  id?: string
  createdAt?: string
  updatedAt?: string
  status?: OrderStatus
  paymentStatus?: OrderPaymentStatus
  total?: number
  items: OrderLine[]
  customer: CustomerInfo
  paymentMethod?: string
  provider?: string
  providerRef?: string
}

export type OrderUpdateInput = Partial<
  Pick<
    OrderRecord,
    'status' | 'paymentStatus' | 'paymentMethod' | 'provider' | 'providerRef'
  >
> & {
  total?: number
  items?: OrderLine[]
  customer?: CustomerInfo
}
