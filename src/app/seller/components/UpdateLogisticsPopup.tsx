'use client'
import React, { useState, useEffect } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { abi } from '../../../../public/purchaseorder_abi'

interface UpdateLogisticsPopupProps {
  orderId: number
  onClose: () => void
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress

const UpdateLogisticsPopup: React.FC<UpdateLogisticsPopupProps> = ({
  orderId,
  onClose,
}) => {
  const [trackingId, setTrackingId] = useState<string>('')
  const [shippingDate, setShippingDate] = useState<string>('')
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string>('')
  const [logisticsProvider, setLogisticsProvider] = useState<string>('')
  const { address, isConnecting, isDisconnected } = useAccount()
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const { data: hash, writeContract } = useWriteContract()
  const { data, isLoading, isError } = useWaitForTransactionReceipt({
    hash: hash,
  })

  useEffect(() => {
    if (hash) {
      const shortHash = `${hash.slice(0, 8)}...${hash.slice(-8)}`
      const etherscanLink = `https://cardona-zkevm.polygonscan.com/tx/${hash}`
      toast({
        title: 'Transaction Success!',
        description: `Hash: ${shortHash}`,
        duration: 8000,
        className: 'bg-lime-300 border-lime-500 pt-4 pl-4 pb-4',
        action: (
          <a
            href={etherscanLink}
            target="_blank"
            className="text-lime-700 bg-yellow-200 mt-1 py-2 px-2 rounded-lg text-sm text-center font-semibold hover:text-lime-800 hover:bg-yellow-100"
          >
            View Transaction
          </a>
        ),
      })
    }
    if (data?.logs) {
      setLoading(false)
      toast({
        title: 'Logistics Details Updated!',
        description: `Purchase Order ${orderId}'s Logistics Details updated successfully`,
        className: 'bg-lime-300 border-lime-500 pt-4 pl-4 pb-4',
        duration: 5000,
      })
      onClose()
    }
  }, [data, hash])

  const uploadTextToServer = async (name: string, text: string) => {
    const response = await fetch(`${SERVER_URL}/uploadText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, text }),
    })
    return await response.json()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const logisticsDetailsJson = {
        logistics_Provider: logisticsProvider,
        tracking_ID: trackingId,
        shipping_Date: shippingDate,
        estimated_Delivery_Date: estimatedDeliveryDate,
      }
      const response = await uploadTextToServer(
        address as string,
        JSON.stringify(logisticsDetailsJson)
      )
      const result = response.uploadResponse.data.Hash
      writeContract({
        abi,
        address: contractAddress,
        functionName: 'updateLogistics',
        args: [BigInt(orderId), result],
      })
    } catch (error) {
      console.error('Failed to upload logistics details to IPFS')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-lime-200 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Update Logistics Details</h2>
        <form onSubmit={handleSubmit}>
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
              className="w-full p-2 border bg-lime-100 text-gray-600 border-lime-200 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Wallet Address</label>
            <input
              type="text"
              value={address}
              readOnly
              className="w-full p-2 border bg-lime-100 text-gray-600 border-lime-200  rounded mt-1"
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
            <Button
              type="submit"
              className="bg-lime-700 text-white px-4 py-2 rounded-lg hover:bg-lime-600"
              disabled={loading}
            >
              {loading ? (
                <span className="loader inline-block w-5 h-5 border-l-2 border-b-2 border-t-2 border-white rounded-full animate-spin"></span>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateLogisticsPopup
