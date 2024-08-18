import React, { useState, useEffect } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { abi } from '../../../../public/purchaseorder_abi'
import { abi as abi2 } from '../../../../public/stakeholder_abi'
import { Button } from '@/components/ui/button'
import PayInitialPopup from './PayInitialPopup'
import CompleteOrderPopup from './CompleteOrderPopup'

const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress

const contractAddress2 = process.env
  .NEXT_PUBLIC_CONTRACT1_ADDRESS as CryptoAddress

interface OrderCardProps {
  orderId: number
  supplierAddress: string
}

const statusSteps = [
  'Created',
  'Accepted',
  'Confirmed',
  'Dispatched',
  'Delivered',
  'Completed',
]

const OrderCard: React.FC<OrderCardProps> = ({ orderId, supplierAddress }) => {
  const [orderStatus, setOrderStatus] = useState<number | null>(null)
  const [supplierName, setSupplierName] = useState<string | null>(null)
  const [isPayPopupOpen, setIsPayPopupOpen] = useState<boolean>(false)
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false)
  const { address: connectedAddress } = useAccount()

  const { data } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: 'getOrderStatus',
    args: [BigInt(orderId)],
  })

  const { data: supplierData } = useReadContract({
    address: contractAddress2,
    abi: abi2,
    functionName: 'getSupplier',
    account: connectedAddress,
    args: [supplierAddress],
  })

  useEffect(() => {
    if (data !== undefined) {
      console.log(data)
      setOrderStatus(Number(data))
    }
    if (supplierData !== undefined) {
      console.log(supplierData)
      const [name] = supplierData as [string, string]
      setSupplierName(name)
    }
  }, [data, supplierData])

  const handlePayInitialAmount = () => {
    setIsPayPopupOpen(true)
  }

  const handleCompleteOrder = () => {
    setIsConfirmPopupOpen(true)
  }

  return (
    <div className="border p-4 bg-lime-200 rounded-md shadow-sm mb-4 flex">
      <div className="w-1/2">
        <h2 className="text-xl font-bold mb-2">Order ID: {orderId}</h2>
        <h3 className="text-lg font-semibold mb-2">Order Details:</h3>
        {supplierName && (
          <div className="mb-2">
            <strong>Seller :</strong> {supplierName}
          </div>
        )}
        <div className="mb-2">
          <strong>Seller Address:</strong> {supplierAddress}
        </div>
        <div className="flex pt-3 space-x-6">
          <Button
            onClick={handlePayInitialAmount}
            disabled={orderStatus !== 1}
            className="bg-amber-500 disabled:bg-lime-700 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg"
          >
            Pay Initial Amount
          </Button>
          <Button
            onClick={handleCompleteOrder}
            className="bg-amber-500 disabled:bg-lime-700 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg"
            disabled={orderStatus !== 4}
          >
            Complete Order
          </Button>
        </div>
      </div>
      <div className="flex w-1/2 justify-end mb-4">
        <div className="flex-col items-center">
          <h1 className="text-lg font-bold pb-3">Order Status:</h1>
          <div className="flex items-center mr-4">
            {statusSteps.map((status, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    orderStatus && orderStatus >= index
                      ? 'bg-yellow-500'
                      : 'bg-gray-300'
                  }`}
                />
                {index < statusSteps.length - 1 && (
                  <div
                    className={`w-8 h-1 ${
                      orderStatus && orderStatus > index
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="pt-2">
            {orderStatus !== null ? statusSteps[orderStatus] : 'Loading...'}
          </div>
        </div>
      </div>
      {isPayPopupOpen && (
        <PayInitialPopup
          orderId={orderId}
          onClose={() => setIsPayPopupOpen(false)}
        />
      )}
      {isConfirmPopupOpen && (
        <CompleteOrderPopup
          orderId={orderId}
          onClose={() => setIsConfirmPopupOpen(false)}
        />
      )}
    </div>
  )
}

export default OrderCard
