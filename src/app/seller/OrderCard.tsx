'use client'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useReadContract } from 'wagmi'
import { abi } from '../../../public/purchaseorder_abi'
import AcceptOrderPopup from './components/AcceptOrderPopup'
import UpdateLogisticsPopup from './components/UpdateLogisticsPopup'
import ConfirmDeliveryPopup from './components/ConfirmDeliveryPopup'
import { Button } from '@/components/ui/button'

interface OrderCardProps {
  orderId: number
  buyerAddress: string
}

const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress
const contractAddress2 = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress

const OrderCard: React.FC<OrderCardProps> = ({ orderId, buyerAddress }) => {
  const [orderDetailsHash, setOrderDetailsHash] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [orderStatus, setOrderStatus] = useState<number>(0)
  const [isAcceptOrderPopupOpen, setIsAcceptOrderPopupOpen] = useState(false)
  const [isUpdateLogisticsPopupOpen, setIsUpdateLogisticsPopupOpen] =
    useState(false)
  const [isConfirmDeliveryPopupOpen, setIsConfirmDeliveryPopupOpen] =
    useState(false)
  const { address: connectedAddress } = useAccount()

  const { data: orderHash } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getOrderDetailsHash',
    account: connectedAddress,
    args: [BigInt(orderId)],
  })

  const { data: statusData } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getOrderStatus',
    args: [BigInt(orderId)],
  })

  useEffect(() => {
    if (orderHash) {
      const hash = orderHash as string
      setOrderDetailsHash(hash)

      // Fetch the details from IPFS
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(
            `https://gateway.lighthouse.storage/ipfs/${hash}`
          )
          const data = await response.json()
          setOrderDetails(data)
        } catch (error) {
          console.error('Error fetching order details:', error)
        }
      }

      fetchOrderDetails()
    }
    if (statusData !== undefined) {
      console.log('statusData:', statusData)
      setOrderStatus(Number(statusData))
    }
  }, [orderHash, statusData])

  const handleAcceptOrder = () => setIsAcceptOrderPopupOpen(true)
  const handleUpdateLogistics = () => setIsUpdateLogisticsPopupOpen(true)
  const handleConfirmDelivery = () => setIsConfirmDeliveryPopupOpen(true)

  const renderStatusText = (status: number) => {
    const statusTexts = [
      'Created',
      'Accepted',
      'Confirmed',
      'Dispatched',
      'Delivered',
      'Completed',
      'Disputed',
    ]
    return statusTexts[status] || 'Unknown'
  }

  return (
    <div className="border p-6 rounded-xl shadow-lg bg-yellow-100 flex justify-between items-start">
      <div className="w-1/2 px-2">
        <h2 className="text-xl font-bold mb-2">Order ID: {orderId}</h2>
        <p className="mb-2">
          <strong>Buyer Address:</strong> {buyerAddress}
        </p>
        {orderDetails && (
          <div className="mb-2">
            <h3 className="text-lg font-semibold mb-2">Order Details:</h3>
            <p>
              <strong>Item Name:</strong> {orderDetails.itemName}
            </p>
            <p>
              <strong>Quantity:</strong> {orderDetails.quantity}
            </p>
            <p>
              <strong>Shipping Address:</strong> {orderDetails.shippingAddress}
            </p>
          </div>
        )}
        <div className="flex gap-2 mt-8">
          <button
            onClick={handleAcceptOrder}
            className="bg-lime-700 disabled:bg-amber-500 disabled:bg-opacity-80 text-white p-2 rounded hover:bg-lime-600"
            disabled={orderStatus !== 0}
          >
            Accept Order
          </button>
          <button
            onClick={handleUpdateLogistics}
            className="bg-lime-700 disabled:bg-amber-500  disabled:bg-opacity-70 text-white p-2 rounded hover:bg-lime-600"
            disabled={orderStatus !== 2}
          >
            Update Logistics
          </button>
          <button
            onClick={handleConfirmDelivery}
            className="bg-lime-700 disabled:bg-amber-500 disabled:bg-opacity-70 text-white p-2 rounded hover:bg-lime-600"
            disabled={orderStatus !== 3}
          >
            Confirm Delivery
          </button>
        </div>
      </div>
      <div className="text-center px-4 py-2 grid">
        <strong>Order Status: </strong>
        <span>{renderStatusText(orderStatus)}</span>
      </div>
      {isAcceptOrderPopupOpen && (
        <AcceptOrderPopup
          orderId={orderId}
          buyerAddress={buyerAddress}
          onClose={() => setIsAcceptOrderPopupOpen(false)}
        />
      )}
      {isUpdateLogisticsPopupOpen && (
        <UpdateLogisticsPopup
          orderId={orderId}
          onClose={() => setIsUpdateLogisticsPopupOpen(false)}
        />
      )}
      {isConfirmDeliveryPopupOpen && (
        <ConfirmDeliveryPopup
          orderId={orderId}
          onClose={() => setIsConfirmDeliveryPopupOpen(false)}
        />
      )}
    </div>
  )
}

export default OrderCard
