import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { abi } from '../../../public/stakeholder_abi'
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import CreatePo from './CreatePo'

interface SellerCardProps {
  walletAddress: string
}

interface SupplierData {
  name: string
  publicDetailsHash: string
}

const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT1_ADDRESS as CryptoAddress

const SellerCard: React.FC<SellerCardProps> = ({ walletAddress }) => {
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const result = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getSupplier',
    args: [walletAddress],
  })
  useEffect(() => {
    if (result.data) {
      console.log(result.data)
      const [name, publicDetailsHash] = result.data as [string, string]
      setSupplierData({ name, publicDetailsHash })
    }
  }, [result.data])

  const handleButtonClick = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  return (
    <Card className="w-[450px] bg-lime-200">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {supplierData?.name || 'Unknown Supplier'}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm">
          <strong>Address:</strong> {walletAddress}
        </p>
        {/* <p className="text-gray-600 mt-2 text-sm">
          <strong>Details Hash:</strong>{' '}
          {supplierData?.publicDetailsHash || 'N/A'}
        </p> */}
      </CardContent>
      <div className="p-4 text-center">
        <button
          onClick={handleButtonClick}
          className="bg-lime-700 text-white py-2 px-4 text-sm rounded-lg hover:bg-lime-600 transition"
        >
          Create a Purchase Order
        </button>
      </div>
      {isPopupOpen && supplierData && (
        <CreatePo
          onClose={handleClosePopup}
          supplierName={supplierData.name}
          supplierWalletAddress={walletAddress}
        />
      )}
    </Card>
  )
}

export default SellerCard
