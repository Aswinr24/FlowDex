'use client'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface UpdateLogisticsPopupProps {
  orderId: number
  onClose: () => void
}

const UpdateLogisticsPopup: React.FC<UpdateLogisticsPopupProps> = ({
  orderId,
  onClose,
}) => {
  const [trackingId, setTrackingId] = useState('')
  const [shippingDate, setShippingDate] = useState('')
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('')
  const [logisticsProvider, setLogisticsProvider] = useState('')
  const { address, isConnecting, isDisconnected } = useAccount()

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Tracking ID:', trackingId)
    console.log('Shipping Date:', shippingDate)
    console.log('Estimated Delivery Date:', estimatedDeliveryDate)
    console.log('Logistics Provider:', logisticsProvider)
    console.log('Order ID:', orderId)
    onClose() // Close the popup after submission
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-lime-200 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Update Logistics Details</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Logistics Partner</label>
          <input
            type="text"
            placeholder="Enter the logistics provider"
            value={logisticsProvider}
            onChange={(e) => setLogisticsProvider(e.target.value)}
            className="w-full p-2 border bg-lime-50 border-lime-200 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tracking ID</label>
          <input
            type="text"
            placeholder="Enter the tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full p-2 border bg-lime-50 border-lime-200 rounded mt-1"
          />
        </div>
        <div className="flex gap-6 mb-4">
          <div className="flex flex-col space-y-2 pb-2 w-1/2">
            <label className="block text-gray-700">Shipping Date</label>
            <input
              type="date"
              value={shippingDate}
              onChange={(e) => setShippingDate(e.target.value)}
              className="w-full p-2 border bg-lime-50 border-lime-200 rounded mt-1"
            />
          </div>
          <div className="flex flex-col space-y-2 pb-2 w-1/2">
            <label className="block text-gray-700">
              Estimated Delivery Date
            </label>
            <input
              type="date"
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              className="w-full p-2 border bg-lime-50 border-lime-200 rounded mt-1"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Order ID</label>
          <input
            type="text"
            value={orderId}
            readOnly
            className="w-full p-2 border bg-lime-50 border-lime-200 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Wallet Address</label>
          <input
            type="text"
            value={address}
            readOnly
            className="w-full p-2 border bg-lime-50 border-lime-200  rounded mt-1"
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 py-2 rounded-lg mr-2"
          >
            Cancel
          </Button>
          <button
            onClick={handleSubmit}
            className="bg-lime-700 text-white px-4 py-2 rounded-lg hover:bg-lime-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateLogisticsPopup
