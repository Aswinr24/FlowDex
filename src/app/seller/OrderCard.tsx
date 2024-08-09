'use client'
import { useState, useEffect } from 'react'
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { abi } from '../../../public/purchaseorder_abi'
import AcceptOrderPopup from './components/AcceptOrderPopup'
import UpdateLogisticsPopup from './components/UpdateLogisticsPopup'
import ConfirmDeliveryPopup from './components/ConfirmDeliveryPopup'

interface OrderCardProps {
  orderId: number
  buyerAddress: string
}

const OrderCard: React.FC<OrderCardProps> = ({ orderId, buyerAddress }) => {
  const [orderDetailsHash, setOrderDetailsHash] = useState<string | null>(null)
  const [logisticsDetails, setLogisticsDetails] = useState<string>('')
  const [isAcceptOrderPopupOpen, setIsAcceptOrderPopupOpen] = useState(false)
  const [isUpdateLogisticsPopupOpen, setIsUpdateLogisticsPopupOpen] =
    useState(false)
  const [isConfirmDeliveryPopupOpen, setIsConfirmDeliveryPopupOpen] =
    useState(false)
  const { data: hash, writeContract } = useWriteContract()

  // Contract address should be replaced with the actual contract address
  const contractAddress = '0x80d8BFA8e63E3D4162a1F8ccFb58b624Fa0c8111'

  const { data: orderHash } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getOrderDetailsHash',
    args: [BigInt(orderId)],
  })

  useEffect(() => {
    if (orderHash) {
      console.log(orderHash)
      setOrderDetailsHash(orderHash as string)
    }
  }, [orderHash])

  const { data, isLoading, isError } = useWaitForTransactionReceipt({
    hash: hash,
  })

  const handleAcceptOrder = () => {
    setIsAcceptOrderPopupOpen(true) // Open the AcceptOrderPopup
  }

  const handleUpdateLogistics = () => {
    setIsUpdateLogisticsPopupOpen(true)
  }

  const handleConfirmDelivery = () => {
    setIsConfirmDeliveryPopupOpen(true)
  }

  return (
    <div className="border p-4 rounded-xl shadow-lg bg-yellow-100">
      <h2 className="text-xl font-bold mb-2">Order ID: {orderId}</h2>
      <p className="mb-2">
        <strong>Buyer Address:</strong> {buyerAddress}
      </p>
      <p className="mb-2">
        <strong>Order Details Hash:</strong> {orderDetailsHash || 'Loading...'}
      </p>
      <div className="flex gap-2 mt-8">
        <button
          onClick={handleAcceptOrder}
          className="bg-lime-700 text-white p-2 rounded hover:bg-lime-600"
        >
          Accept Order
        </button>
        <button
          onClick={handleUpdateLogistics}
          className="bg-amber-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Update Logistics
        </button>
        <button
          onClick={handleConfirmDelivery}
          className="bg-lime-700 text-white p-2 rounded hover:bg-lime-600"
        >
          Confirm Delivery
        </button>
      </div>
      {isAcceptOrderPopupOpen && (
        <AcceptOrderPopup
          orderId={orderId}
          onClose={() => setIsAcceptOrderPopupOpen(false)} // Close the popup
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
