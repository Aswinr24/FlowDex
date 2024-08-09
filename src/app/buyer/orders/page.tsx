'use client'
import { useEffect, useState } from 'react'
import {
  useAccount,
  useWatchContractEvent,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { abi } from '../../../../public/stakeholder_abi'

interface Order {
  orderCount: number
  supplier: string
}

export default function OrdersPage() {
  const { address: userAddress } = useAccount()
  const [orders, setOrders] = useState<Order[]>([])

  const result = useWaitForTransactionReceipt({
    hash: '0xaea08121c14c96180f0bfe302268b68b70aa5e8a82925a225d8ff57bf0b83ea3',
  })

  // Extracting the order ID and supplier address
  const orderIdHex = result.data?.logs[0].topics[1] as string
  const orderIdBigInt = BigInt(orderIdHex)
  const orderIdInt = Number(orderIdBigInt)
  const supplierAddressHex = result.data?.logs[0].topics[2] as string
  const supplierAddress = `0x${supplierAddressHex.slice(26)}`

  useEffect(() => {
    if (orderIdInt && supplierAddress) {
      setOrders([{ orderCount: orderIdInt, supplier: supplierAddress }])
    }
  }, [orderIdInt, supplierAddress])

  const handlePayInitialAmount = (orderId: number) => {
    // Functionality for paying the initial amount
    console.log(`Paying initial amount for Order ID: ${orderId}`)
  }

  const handleGetDetails = (orderId: number) => {
    // Functionality for getting details of the order
    console.log(`Getting details for Order ID: ${orderId}`)
  }

  const handleCompleteOrder = (orderId: number) => {
    console.log(`Completing Order ID: ${orderId}`)
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.orderCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => handlePayInitialAmount(order.orderCount)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Pay Initial Amount
                  </button>
                  <button
                    onClick={() => handleGetDetails(order.orderCount)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Get Details
                  </button>
                  <button
                    onClick={() => handleCompleteOrder(order.orderCount)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Complete Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </main>
  )
}
