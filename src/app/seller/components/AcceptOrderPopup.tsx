import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AcceptOrderPopupProps {
  orderId: number
  onClose: () => void
}

const AcceptOrderPopup: React.FC<AcceptOrderPopupProps> = ({
  orderId,
  onClose,
}) => {
  const [totalAmount, setTotalAmount] = useState('')
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('')
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const { address, isConnecting, isDisconnected } = useAccount()

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Total Amount:', totalAmount)
    console.log('Estimated Delivery Date:', estimatedDeliveryDate)
    console.log('Invoice File:', invoiceFile)
    console.log('Wallet Address:', address)
    console.log('Order ID:', orderId)
    onClose() // Close the popup after submission
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-lime-200 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Accept Order</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Total Amount</label>
          <input
            type="text"
            placeholder="Enter the total amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full p-2 border bg-lime-50 border-lime-200 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Estimated Delivery Date</label>
          <input
            type="date"
            value={estimatedDeliveryDate}
            onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
            className="w-full p-2 border bg-lime-50 border-lime-200  rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Estimated Invoice Document
          </label>
          <Input
            type="file"
            onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
            className="w-full p-2 border bg-lime-50 border-lime-200  rounded mt-1"
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
        <div className="mb-4">
          <label className="block text-gray-700">Order ID</label>
          <input
            type="text"
            value={orderId}
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

export default AcceptOrderPopup
