import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAccount, useWriteContract } from 'wagmi'
import { FormEvent } from 'react'
import { abi } from '../../../public/stakeholder_abi'
import { Toast } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

interface BuyerRegisterPopupProps {
  nameOfBusiness: string
  onClose: () => void
}
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export default function BuyerRegisterPopup({
  nameOfBusiness,
  onClose,
}: BuyerRegisterPopupProps) {
  const [business, setBusiness] = useState<string>(nameOfBusiness)
  const [businessType, setBusinessType] = useState<string>('individual')
  const [tinNumber, setTinNumber] = useState<string>('')
  const [documents, setDocuments] = useState<File | null>(null)
  const [cashFlow, setCashFlow] = useState<File | null>(null)
  const [website, setWebsite] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [phoneno, setPhoneno] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const { address, isConnecting, isDisconnected } = useAccount()
  const router = useRouter()
  const { data: hash, writeContract } = useWriteContract()
  const { toast } = useToast()

  const uploadFileToIPFS = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`${SERVER_URL}/uploadDocument`, {
      method: 'POST',
      body: formData,
    })
    return await response.json()
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

  useEffect(() => {
    console.log('hee')
    if (hash) {
      toast({
        title: 'Transaction Success!',
        description: `Transaction Hash: ${hash}`,
        className: 'bg-lime-300 border-lime-500 pt-4 pb-4',
      }),
        setTimeout(() => {
          router.push('/buyer')
        }, 5000) // 5 seconds
    }
  }, [hash])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      let documentHash = ''
      let cashflowHash = ''
      if (documents) {
        const result = await uploadFileToIPFS(documents)
        const data = result.uploadResponse.data
        console.log(result)
        documentHash = data.Hash
      }
      if (cashFlow) {
        const result = await uploadFileToIPFS(cashFlow)
        const data = result.uploadResponse.data
        cashflowHash = data.Hash
      }

      const documentsJson = {
        document_hash: documentHash,
        cashflow_hash: cashflowHash,
      }
      const documentsResponse = await uploadTextToServer(
        business,
        JSON.stringify(documentsJson)
      )
      const documentsHash = documentsResponse.uploadResponse.data.Hash

      const privateDetailsResponse = await uploadTextToServer(
        business,
        tinNumber
      )
      const privateDetailsHash = privateDetailsResponse.uploadResponse.data.Hash

      const publicDetailsJson = {
        phoneNumber: phoneno,
        emailAddress: email,
        websiteURL: website,
        businessType: businessType,
        businessLocation: location,
      }
      const publicDetailsResponse = await uploadTextToServer(
        business,
        JSON.stringify(publicDetailsJson)
      )
      const publicDetailsHash = publicDetailsResponse.uploadResponse.data.Hash

      console.log('Public Details Hash:', publicDetailsHash)
      writeContract({
        abi,
        address: '0x11eAC6Bb9C4A319B6c7F40d203444d227f030c1D',
        functionName: 'registerBuyer',
        args: [business, publicDetailsHash, privateDetailsHash, documentsHash],
      })
      console.log('Submitted')
    } catch (error) {
      console.error('Error during submission:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-yellow-200 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Register as a Buyer</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-6">
              <div className="flex flex-col w-1/2 space-y-2 pb-0.5">
                <Label htmlFor="businessName">Name Of Your Business</Label>
                <Input
                  id="businessName"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-1/2 space-y-2">
                <Label htmlFor="businessType">Type of Business</Label>
                <Select onValueChange={(value) => setBusinessType(value)}>
                  <SelectTrigger className="bg-yellow-50 border-yellow-300">
                    <SelectValue
                      className="bg-yellow-50 border-yellow-300"
                      placeholder="Select business type"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-yellow-50 border-yellow-300">
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="wholesale_distributor">
                      Wholesale Distributor
                    </SelectItem>
                    <SelectItem value="sme">SME</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <div className="flex flex-col w-1/2 space-y-2 pb-1">
                <label htmlFor="phoneno">Phone no:</label>
                <Input
                  id="phoneno"
                  value={phoneno}
                  onChange={(e) => setPhoneno(e.target.value)}
                  placeholder="+91 "
                  className="text-black bg-yellow-50 border-yellow-300"
                />
              </div>
              <div className="flex flex-col w-1/2 space-y-2">
                <label htmlFor="email">e-mail :</label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-yellow-50 border-yellow-300"
                />
              </div>
            </div>
            {businessType !== 'individual' && (
              <>
                <div className="flex gap-6">
                  <div className="flex flex-col space-y-2 pb-1">
                    <Label htmlFor="documents">
                      Proof of Business Documents
                    </Label>
                    <Input
                      id="documents"
                      type="file"
                      className="mt-1 bg-yellow-50 border-yellow-300"
                      onChange={(e) =>
                        setDocuments(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                  <div className="flex flex-col space-y-2 pb-1">
                    <Label htmlFor="cashFlow">Cash Flow / Credit History</Label>
                    <Input
                      id="cashFlow"
                      type="file"
                      className="mt-1 bg-yellow-50 border-yellow-300"
                      onChange={(e) => setCashFlow(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex flex-col w-1/2 space-y-2 pb-0">
                    <Label htmlFor="tinNumber">TIN Number</Label>
                    <Input
                      id="tinNumber"
                      className="mt-1 bg-yellow-50 border-yellow-300"
                      value={tinNumber}
                      onChange={(e) => setTinNumber(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-1/2 space-y-2 pb-0">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      className="mt-1 bg-yellow-50 border-yellow-300"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="address">Location / Address</Label>
              <Textarea
                id="address"
                className="mt-1 bg-yellow-50 border-yellow-300 "
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="walletaddress" className="text-sm">
                Wallet Address:
              </label>
              <Input
                id="walletaddress"
                value={address}
                readOnly
                className="bg-yellow-100 cursor-default text-gray-700 border-yellow-300"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" className="rounded-lg" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-lime-600 hover:bg-amber-500 rounded-lg"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
