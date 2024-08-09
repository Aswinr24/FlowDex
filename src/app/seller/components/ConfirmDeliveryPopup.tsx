'use client'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ConfirmDeliveryPopupProps {
  orderId: number
  onClose: () => void
}

const ConfirmDeliveryPopup: React.FC<ConfirmDeliveryPopupProps> = ({
  orderId,
  onClose,
}) => {
  const [finalInvoiceFile, setFinalInvoiceFile] = useState<File | null>(null)
  const { address } = useAccount()

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Final Invoice File:', finalInvoiceFile)
    console.log('Wallet Address:', address)
    console.log('Order ID:', orderId)
    onClose() // Close the popup after submission
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-lime-200 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Delivery</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Final Invoice Document</label>
          <Input
            type="file"
            onChange={(e) => setFinalInvoiceFile(e.target.files?.[0] || null)}
            className="w-full p-2 border bg-lime-50 border-lime-200 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Your Wallet Address</label>
          <input
            type="text"
            value={address}
            readOnly
            className="w-full p-2 border bg-lime-50 border-lime-200 rounded mt-1"
          />
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
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 py-2 rounded-lg mr-2 text-md"
          >
            Cancel
          </Button>
          <button
            onClick={handleSubmit}
            className="bg-lime-700 text-white px-4 py-2 rounded-lg hover:bg-lime-800"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeliveryPopup
