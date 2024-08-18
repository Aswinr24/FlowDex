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

interface ConfirmDeliveryPopupProps {
  orderId: number
  onClose: () => void
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress

const ConfirmDeliveryPopup: React.FC<ConfirmDeliveryPopupProps> = ({
  orderId,
  onClose,
}) => {
  const [finalInvoiceFile, setFinalInvoiceFile] = useState<File | null>(null)
  const { address } = useAccount()
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
        title: 'Order Delivery Confirmed!',
        description: `Purchase Order ${orderId}'s Final Invoice has been submitted successfully.`,
        className: 'bg-lime-300 border-lime-500 pt-4 pl-4 pb-4',
        duration: 5000,
      })
      onClose()
    }
  }, [data, hash])

  const uploadFileToIPFS = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`${SERVER_URL}/uploadDocument`, {
      method: 'POST',
      body: formData,
    })
    return await response.json()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      let finalInvoiceFileHash = ''
      if (finalInvoiceFile) {
        const result = await uploadFileToIPFS(finalInvoiceFile)
        const data = result.uploadResponse.data
        finalInvoiceFileHash = data.Hash
      }
      console.log('finalInvoiceFileHash', finalInvoiceFileHash)
      writeContract({
        abi,
        address: contractAddress,
        functionName: 'confirmDelivery',
        args: [BigInt(orderId), finalInvoiceFileHash],
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-lime-200 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Delivery</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              Final Invoice Document
            </label>
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
              className="w-full p-2 border bg-lime-100 text-gray-600 border-lime-200 rounded mt-1"
            />
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
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-4 py-2 rounded-lg mr-2 text-md"
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

export default ConfirmDeliveryPopup
