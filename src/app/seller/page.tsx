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
import Web3 from 'web3'
import { ethers } from 'ethers'

interface Order {
  orderId: number
  buyerAddress: string
}

const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress

export default function SellerPage() {
  const { address: supplierAddress } = useAccount()
  const [orders, setOrders] = useState<Order[]>([])

  const { data: ordersData } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getAllOrders',
  }) as { data: OrdersData }

  useEffect(() => {
    if (!ordersData || !supplierAddress) return
    const orderIds = (ordersData[0] as BigInt[]).map((id) => Number(id))
    const buyers = ordersData[1] as string[]
    const suppliers = ordersData[2] as string[]
    const filteredOrders: Order[] = []
    for (let i = 0; i < orderIds.length; i++) {
      if (suppliers[i].toLowerCase() === supplierAddress.toLowerCase()) {
        filteredOrders.push({
          orderId: orderIds[i], // Now this is a regular Number
          buyerAddress: buyers[i],
        })
      }
    }

    setOrders(filteredOrders)
  }, [ordersData, supplierAddress])
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
        </div>
      </main>
    </main>
  )
}
