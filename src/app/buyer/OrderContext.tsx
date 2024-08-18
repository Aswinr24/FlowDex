// OrderContext.tsx
import React, { createContext, useState, useContext } from 'react'

interface OrderDetails {
  itemName: string
  quantity: string
  shippingAddress: string
}

interface OrderContextType {
  orderDetails: OrderDetails | null
  setOrderDetails: (details: OrderDetails) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  return (
    <OrderContext.Provider value={{ orderDetails, setOrderDetails }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
