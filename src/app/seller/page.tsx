'use client'
import { useEffect, useState } from 'react'
import {
  useAccount,
  useWatchContractEvent,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { Log } from 'ethers'
import { abi } from '../../../public/purchaseorder_abi'
import OrderCard from './OrderCard'
import Navbar from '../components/Navbar'

interface Order {
  orderId: number
  buyerAddress: string
}

export default function SellerPage() {
  const { address: supplierAddress } = useAccount()
  const [orders, setOrders] = useState<Order[]>([])
  const contractAddress = '0x80d8BFA8e63E3D4162a1F8ccFb58b624Fa0c8111'

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'OrderRequested',
    onLogs(logs) {
      logs.forEach((log) => {
        const orderId = parseInt(log.data.slice(0, 66), 16) // Adjust based on actual data structure
        const buyerAddress = `0x${log.data.slice(66)}` // Adjust based on actual data structure
        console.log(log)
        if (buyerAddress.toLowerCase() === supplierAddress?.toLowerCase()) {
          setOrders((prevOrders) => [...prevOrders, { orderId, buyerAddress }])
        }
      })
    },
  })

  return (
    <main>
      <Navbar />
      <main className="pt-24 px-6">
        <h1 className="text-2xl font-bold mb-4">Orders for Supplier</h1>
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              orderId={order.orderId}
              buyerAddress={order.buyerAddress}
            />
          ))}
          <OrderCard
            orderId={1}
            buyerAddress={'0x151E9339775024Ff22700a9b3926648002C7C6bc'}
          />
        </div>
      </main>
    </main>
  )
}
