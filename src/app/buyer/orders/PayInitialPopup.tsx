import React, { useState, useEffect } from 'react'
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi'
import { Button } from '@/components/ui/button'
import { ethers } from 'ethers'
import { abi } from '../../../../public/purchaseorder_abi'
import { useToast } from '@/components/ui/use-toast'

const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT2_ADDRESS as CryptoAddress

interface PayInitialPopupProps {
  onClose: () => void
  orderId: number
}

const PayInitialPopup: React.FC<PayInitialPopupProps> = ({
  onClose,
  orderId,
}) => {
  const [invoiceHash, setInvoiceHash] = useState<string | null>(null)
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<
    string | null
  >(null)
  let escrowAmt: bigint
  const [totalAmount, setTotalAmount] = useState<string | null>(null)
  const [escrowAmount, setEscrowAmount] = useState<string | null>(null)
  const { address, isConnecting, isDisconnected } = useAccount()
  const [loading, setLoading] = useState<boolean>(false)
  const { data: payData } = useReadContract({
    address: contractAddress,
    abi: abi,
    account: address,
    functionName: 'getOrderEstimateDetails',
    args: [BigInt(orderId)],
  })
  const { data: hash, writeContract } = useWriteContract()
  const { data, isLoading, isError } = useWaitForTransactionReceipt({
    hash: hash,
  })
  const { toast } = useToast()

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
        title: 'Payment Success!',
        description: `Initial payment has been made successfully.`,
        className: 'bg-lime-300 border-lime-500 pt-4 pl-4 pb-4',
        duration: 5000,
      })
      onClose()
    }
    if (payData) {
      const [invoiceHash, estimatedDeliveryDate, totalAmount, escrowAmount] =
        payData as [string, string, BigInt, BigInt]
      setInvoiceHash(invoiceHash)
      setEstimatedDeliveryDate(estimatedDeliveryDate)
      escrowAmt = escrowAmount as bigint
      setTotalAmount(ethers.formatUnits(Number(totalAmount), 'ether'))
      setEscrowAmount(ethers.formatUnits(Number(escrowAmount), 'ether'))
    }
  }, [payData, hash, data])

  const handlePay = async () => {
    try {
      setLoading(true)
      const value = ethers.parseUnits(
        escrowAmount ? escrowAmount : '1000000000000',
        'ether'
      )
      writeContract({
        abi,
        address: contractAddress,
        functionName: 'payEscrow',
        args: [BigInt(orderId)],
        value: value,
        account: address,
      })
    } catch (error) {
      console.error('Error during payment:', error)
      toast({
        title: 'Payment Failed!',
        description: 'There was an issue processing the payment.',
        className: 'bg-red-300 border-red-500 pt-4 pl-4 pb-4',
      })
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-lime-300 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Order Estimate Details</h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="mr-2">
              <strong>Estimated Invoice:</strong>
            </div>
            {invoiceHash ? (
              <div>
                <a
                  href={`https://gateway.lighthouse.storage/ipfs/${invoiceHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  Click here to view
                </a>
              </div>
            ) : (
              'Loading...'
            )}
          </div>
          <div>
            <strong>Estimated Delivery Date:</strong>{' '}
            {estimatedDeliveryDate || 'N/A'}
          </div>
          <div>
            <strong>Total Amount:</strong>{' '}
            {totalAmount !== null ? `${totalAmount} ETH` : 'N/A'}
          </div>
          <div>
            <strong>Amount to be paid Now:</strong>{' '}
            {escrowAmount !== null ? (
              <strong className="text-lime-800">{escrowAmount} ETH</strong>
            ) : (
              'N/A'
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <Button onClick={onClose} variant="outline" className="rounded-lg">
              Close
            </Button>
            <Button
              onClick={handlePay}
              className="bg-lime-700 hover:bg-lime-600 rounded-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="loader inline-block w-5 h-5 border-l-2 border-b-2 border-t-2 border-white rounded-full animate-spin"></span>
              ) : (
                'Pay'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayInitialPopup
