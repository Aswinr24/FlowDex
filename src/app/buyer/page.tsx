'use client'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useReadContract } from 'wagmi'
import { abi } from '../../../public/stakeholder_abi'
import SellerCard from './SellerCard'
import Sidebar from './Sidebar'
const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT1_ADDRESS as CryptoAddress
interface SupplierData {
  name: string
  publicDetailsHash: string
}

function useSuppliers() {
  const [suppliers, setSuppliers] = useState<string[]>([])

  const result = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getAllSuppliers',
  })

  useEffect(() => {
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      setSuppliers(result.data as string[])
    }
  }, [result.data])

  return suppliers
}

export default function Page() {
  const suppliers = useSuppliers()

  useEffect(() => {
    console.log(suppliers)
  }, [suppliers])

  return (
    <main>
      <Navbar />
      <Sidebar />
      <main className="pt-20 ml-20">
        <div className="flex pt-20 px-36 gap-20 pb-20">
          {suppliers.map((address) => (
            <SellerCard key={address} walletAddress={address} />
          ))}
        </div>
      </main>
    </main>
  )
}
