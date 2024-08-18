'use client'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { abi } from '../../../../public/purchaseorder_abi'
import OrderCard from './OrderCard'
import Navbar from '../../components/Navbar'
import Sidebar from '../Sidebar'

interface Order {
  orderId: number
  supplier: string
}

const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress

export default function OrdersPage() {
  const { address: userAddress } = useAccount()
  const [orders, setOrders] = useState<{ orderId: number; supplier: string }[]>(
    []
  )

  const { data: allOrdersData } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getAllOrders',
  }) as { data: [bigint[], string[], string[]] }

  useEffect(() => {
    if (allOrdersData) {
      const [orderIds, buyers, suppliers] = allOrdersData

      const matchingOrders = orderIds
        .map((orderId, index) => ({
          orderId: Number(orderId), // Convert BigInt to number
          supplier: suppliers[index],
          buyer: buyers[index],
        }))
        .filter((order) => order.buyer === userAddress)
        .map((order) => ({
          orderId: order.orderId,
          supplier: order.supplier,
        }))
      console.log(matchingOrders)
      setOrders(matchingOrders)
    }
  }, [allOrdersData, userAddress])

  return (
    <main>
      <Navbar />
      <Sidebar />
      <main className="pt-20 px-20 pl-32 ml-20">
        <h1 className="text-2xl pt-6 pb-6 font-bold">My Orders</h1>
        {orders.length > 0 ? (
          <div className="space-y-4 ">
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                orderId={order.orderId}
                supplierAddress={order.supplier}
              />
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </main>
    </main>
  )
}
