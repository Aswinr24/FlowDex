import React, { useState, useEffect } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { Button } from '@/components/ui/button'
import { ethers } from 'ethers'
import { abi } from '../../../public/purchaseorder_abi'
import { useToast } from '@/components/ui/use-toast'

const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

interface CreatePoProps {
  onClose: () => void
  supplierName: string
  supplierWalletAddress: string
}

const CreatePo: React.FC<CreatePoProps> = ({
  onClose,
  supplierName,
  supplierWalletAddress,
}) => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    shippingAddress: '',
    userWalletAddress: address || '',
    supplierWalletAddress: supplierWalletAddress,
    supplierName: supplierName,
  })
  const [isTransactionSuccess, setIsTransactionSuccess] =
    useState<boolean>(false)
  const { data: hash, writeContract } = useWriteContract()

  const { data, isLoading, isError } = useWaitForTransactionReceipt({
    hash: hash,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (hash) {
      const shortHash = `${hash.slice(0, 8)}...${hash.slice(-8)}`
      const etherscanLink = `https://sepolia.etherscan.io/tx/${hash}`
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
      alert(`Purchase order requested successfully!`)
      setIsTransactionSuccess(true)
      setTimeout(() => {
        setIsTransactionSuccess(false)
      }, 5000)
    }
  }, [data, hash])

  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Convert formData to JSON and compute its hash
    const jsonData = JSON.stringify({
      itemName: formData.itemName,
      quantity: formData.quantity,
      shippingAddress: formData.shippingAddress,
    })

    const privateDetailsResponse = await uploadTextToServer(
      supplierName,
      JSON.stringify(jsonData)
    )
    console.log(
      'Private details hash:',
      privateDetailsResponse.uploadResponse.data.Hash
    )
    const orderDetailsHash = privateDetailsResponse.uploadResponse.data.Hash
    try {
      writeContract({
        abi,
        address: contractAddress,
        functionName: 'requestOrder',
        args: [supplierWalletAddress, orderDetailsHash],
      })
    } catch (error) {
      console.error('Error sending transaction:', error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-lime-300 p-8 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-xl font-bold mb-4">Create Purchase Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="itemName" className="block text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full p-2 border bg-lime-50 border-lime-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700">
              Quantity
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border bg-lime-50 border-lime-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="shippingAddress" className="block text-gray-700">
              Shipping Address
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              className="w-full p-2 border bg-lime-50 border-lime-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userWalletAddress" className="block text-gray-700">
              Your Wallet Address
            </label>
            <input
              type="text"
              id="userWalletAddress"
              name="userWalletAddress"
              value={address || ''}
              className="w-full p-2 border bg-lime-100 border-lime-300 rounded cursor-default"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="supplierWalletAddress"
              className="block text-gray-700"
            >
              Supplier Wallet Address
            </label>
            <input
              type="text"
              id="supplierWalletAddress"
              name="supplierWalletAddress"
              value={formData.supplierWalletAddress}
              onChange={handleChange}
              className="w-full p-2 border bg-lime-100 border-lime-300 rounded cursor-default"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label htmlFor="supplierName" className="block text-gray-700">
              Supplier Name
            </label>
            <input
              type="text"
              id="supplierName"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              className="w-full p-2 border bg-lime-100 border-lime-300 rounded cursor-default"
              readOnly
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button onClick={onClose} variant="outline" className="rounded-lg">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-lime-700 text-white py-2 px-4 rounded-lg hover:bg-lime-600 transition"
            >
              Submit
            </Button>
          </div>
          {isTransactionSuccess && (
            <div>Purchase Order Request Successfull!</div>
          )}
        </form>
      </div>
    </div>
  )
}

export default CreatePo
