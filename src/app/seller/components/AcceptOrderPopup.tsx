import React, { useState, useEffect } from 'react'
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { abi } from '../../../../public/purchaseorder_abi'
import { abi as abi2 } from '../../../../public/stakeholder_abi'

interface AcceptOrderPopupProps {
  orderId: number
  buyerAddress: string
  onClose: () => void
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress
const contractAddress2 = process.env
  .NEXT_PUBLIC_CONTRACT1_ADDRESS as CryptoAddress

const AcceptOrderPopup: React.FC<AcceptOrderPopupProps> = ({
  orderId,
  buyerAddress,
  onClose,
}) => {
  const [totalAmount, setTotalAmount] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  let buyerName = ''
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('')
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: hash, writeContract } = useWriteContract()
  const { data, isLoading, isError } = useWaitForTransactionReceipt({
    hash: hash,
  })
  const { toast } = useToast()

  const { data: buyer } = useReadContract({
    abi: abi2,
    address: contractAddress2,
    functionName: 'getBuyer',
    args: [buyerAddress as CryptoAddress],
  })

  useEffect(() => {
    if (hash) {
      const shortHash = `${hash.slice(0, 8)}...${hash.slice(-8)}`
      const etherscanLink = `https://cardona-zkevm.polygonscan.com/tx/${hash}`
      toast({
        title: 'Transaction Success!',
        description: `Hash: ${shortHash}`,
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
        title: 'Purchase Order Request Accepted!',
        description: `Purchase Order Request from ${buyerName} accepted successfully`,
        className: 'bg-lime-300 border-lime-500 pt-4 pl-4 pb-4',
        duration: 5000,
      })
      onClose()
    }
    if (buyer && Array.isArray(buyer)) {
      buyerName = buyer[0] as string // Use type assertion to specify that it's a string
    }
  }, [data, hash, buyer])

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
    let estimateInvoiceHash = ''
    if (invoiceFile) {
      const result = await uploadFileToIPFS(invoiceFile)
      estimateInvoiceHash = result.uploadResponse.data.Hash
    }
    try {
      writeContract({
        abi,
        address: contractAddress,
        functionName: 'acceptOrder',
        args: [
          BigInt(orderId),
          estimateInvoiceHash,
          totalAmount,
          estimatedDeliveryDate,
        ],
      })
    } catch (error) {
      console.error('Error sending transaction:', error)
    }
    setLoading(false)
    // Close the popup after submission
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-amber-200 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Accept Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Total Amount</label>
            <Input
              type="number"
              placeholder="Enter the total amount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full p-2 border bg-amber-50 border-amber-200 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Estimated Delivery Date
            </label>
            <input
              type="date"
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              className="w-full p-2 border bg-amber-50 border-amber-200 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Estimated Invoice Document
            </label>
            <Input
              type="file"
              onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
              className="w-full p-2 border bg-amber-50 border-amber-200 rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Wallet Address</label>
            <input
              type="text"
              value={address}
              readOnly
              className="w-full p-2 border text-gray-700 bg-amber-100 border-amber-200 rounded mt-1 cursor-default"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Order ID</label>
            <input
              type="text"
              value={orderId}
              readOnly
              className="w-full p-2 border text-gray-700 bg-amber-100 border-amber-200 rounded mt-1 cursor-default"
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
              className="bg-amber-600 hover:bg-yellow-600 rounded-lg"
              type="submit"
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

export default AcceptOrderPopup
