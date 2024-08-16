import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAccount, useWriteContract } from 'wagmi'
import { useRouter } from 'next/navigation'
import { abi } from '../../../public/stakeholder_abi'
import { useToast } from '@/components/ui/use-toast'
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT1_ADDRESS as CryptoAddress

interface SellerRegisterPopupProps {
  nameOfBusiness: string
  onClose: () => void
}

export default function SellerRegisterPopup({
  nameOfBusiness,
  onClose,
}: SellerRegisterPopupProps) {
  const [business, setBusiness] = useState<string>(nameOfBusiness)
  const [businessType, setBusinessType] = useState<string>('')
  const [tinNumber, setTinNumber] = useState<string>('')
  const [documents, setDocuments] = useState<File | null>(null)
  const [bankstmt, setBankstmt] = useState<File | null>(null)
  const [invoice, setInvoice] = useState<File | null>(null)
  const [website, setWebsite] = useState<string>('')
  const [panno, setPanno] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [phoneno, setPhoneno] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
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
    if (hash) {
      setLoading(true)
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
      }),
        setTimeout(() => {
          router.push('/seller')
          setLoading(false)
        }, 5000) // 5 seconds
    }
  }, [hash])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      let documentHash = ''
      let bankstmtHash = ''
      let invoiceHash = ''
      if (documents) {
        const result = await uploadFileToIPFS(documents)
        const data = result.uploadResponse.data
        documentHash = data.Hash
      }
      if (bankstmt) {
        const result = await uploadFileToIPFS(bankstmt)
        const data = result.uploadResponse.data
        bankstmtHash = data.Hash
      }
      if (invoice) {
        const result = await uploadFileToIPFS(invoice)
        const data = result.uploadResponse.data
        invoiceHash = data.Hash
      }

      const documentsJson = {
        document_hash: documentHash,
        bankstmt_hash: bankstmtHash,
        invoice_hash: invoiceHash,
      }
      const documentsResponse = await uploadTextToServer(
        business,
        JSON.stringify(documentsJson)
      )
      const documentsHash = documentsResponse.uploadResponse.data.Hash

      const privateJson = {
        tinNumber: tinNumber,
        panno: panno,
      }
      const privateDetailsResponse = await uploadTextToServer(
        business,
        JSON.stringify(privateJson)
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
      setLoading(false)
      writeContract({
        abi,
        address: contractAddress,
        functionName: 'registerSupplier',
        args: [business, publicDetailsHash, privateDetailsHash, documentsHash],
      })
      console.log('Submitted')
    } catch (error) {
      console.error('Error during submission:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-yellow-200 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">
          Register as a Seller / Supplier
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-6">
              <div className="flex flex-col  w-1/2  space-y-2 pb-1">
                <Label htmlFor="businessName">Name Of Your Business</Label>
                <Input
                  id="businessName"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-1/2 space-y-2">
                <Label htmlFor="businessType">Type of your Business</Label>
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
                    <SelectItem value="sme">Suppliers</SelectItem>
                    <SelectItem value="individual">
                      Agricultural Producers
                    </SelectItem>
                    <SelectItem value="individual">
                      Artisans and Small-Scale Producers
                    </SelectItem>
                    <SelectItem value="individual">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col w-1/2 space-y-2 pb-2">
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
            <div className="flex gap-6">
              <div className="flex flex-col space-y-2 pb-1">
                <Label htmlFor="documents">
                  Business Registration Documents
                </Label>
                <Input
                  id="documents"
                  type="file"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  onChange={(e) => setDocuments(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex flex-col space-y-2 pb-1">
                <Label htmlFor="invoice">An Invoice Copy</Label>
                <Input
                  id="invoice"
                  type="file"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  onChange={(e) => setInvoice(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex flex-col space-y-2 pb-1">
                <Label htmlFor="bankstmt">Bank Statement</Label>
                <Input
                  id="bankstmt"
                  type="file"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  onChange={(e) => setBankstmt(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col w-1/2 space-y-2 pb-0.5">
                <Label htmlFor="tinNumber">TIN Number</Label>
                <Input
                  id="tinNumber"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/2 space-y-2 pb-0.5">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="pannNumber"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  value={panno}
                  onChange={(e) => setPanno(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/2 space-y-2 pb-0.5">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="Your business's website"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-0">
              <Label htmlFor="address">Location / Address</Label>
              <Textarea
                id="address"
                placeholder="address of your business"
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
                className="bg-yellow-100 cursor-default border-yellow-300 text-gray-600"
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
