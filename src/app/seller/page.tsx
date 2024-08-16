'use client'
import { useEffect, useState } from 'react'
import {
  useAccount,
  useWatchContractEvent,
  useReadContract,
  useWriteContract,
} from 'wagmi'
import { Log } from 'ethers'
import { abi } from '../../../public/stakeholder_abi'
import OrderCard from './OrderCard'
import Navbar from '../components/Navbar'
import Web3 from 'web3'
import { ethers } from 'ethers'

interface Order {
  orderId: number
  buyerAddress: string
}

export default function SellerPage() {
  const { address: supplierAddress } = useAccount()
  const [orders, setOrders] = useState<Order[]>([])
  const contractAddress = '0x11eAC6Bb9C4A319B6c7F40d203444d227f030c1D'

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

  useEffect(() => {
    const listenToOrderRequestedEvent = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.WebSocketProvider(window.ethereum)
          const contract = new ethers.Contract(contractAddress, abi, provider)
          console.log('Listening to OrderRequested event', contract)

          // contract.on('OrderRequested', (orderCount, buyer, supplier) => {
          //   console.log('Hi')
          //   console.log('Order Requested Event:', {
          //     orderCount,
          //     buyer,
          //     supplier,
          //   })
          //   // You can handle the event data here, e.g., update your UI or state
          // })
          contract.on('BuyerRegistered', () => {
            console.log('event')
          })
          contract.on('BuyerRegistered', (buyer, buyerType, message) => {
            console.log('event')
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    listenToOrderRequestedEvent()
  }, [])
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
