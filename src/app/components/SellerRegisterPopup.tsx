import { useState } from 'react'
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
import { useAccount } from 'wagmi'

interface SellerRegisterPopupProps {
  nameOfBusiness: string
  onClose: () => void
}

export default function SellerRegisterPopup({
  nameOfBusiness,
  onClose,
}: SellerRegisterPopupProps) {
  const [business, setBusiness] = useState<string>(nameOfBusiness)
  const [businessType, setBusinessType] = useState<string>('individual')
  const [tinNumber, setTinNumber] = useState<string>('')
  const [documents, setDocuments] = useState<FileList | null>(null)
  const [bankstmt, setBankstmt] = useState<FileList | null>(null)
  const [invoice, setInvoice] = useState<FileList | null>(null)
  const [website, setWebsite] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [phoneno, setPhoneno] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const { address, isConnecting, isDisconnected } = useAccount()

  const handleSubmit = () => {
    // Implement the form submission logic here
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-yellow-200 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">
          Register as a Seller / Supplier
        </h2>
        <form>
          <div className="space-y-4">
            <div className="flex gap-6">
              <div className="flex flex-col  w-1/2  space-y-2 pb-2">
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
                <label htmlFor="institutionName">Phone no:</label>
                <Input
                  id="phoneno"
                  value={phoneno}
                  onChange={(e) => setPhoneno(e.target.value)}
                  placeholder="+91 "
                  className="text-black bg-yellow-50 border-yellow-300"
                />
              </div>
              <div className="flex flex-col w-1/2 space-y-2">
                <label htmlFor="institutionId">e-mail :</label>
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
              <div className="flex flex-col space-y-2 pb-2">
                <Label htmlFor="documents">
                  Business Registration Documents
                </Label>
                <Input
                  id="documents"
                  type="file"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  onChange={(e) => setDocuments(e.target.files)}
                />
              </div>
              <div className="flex flex-col space-y-2 pb-2">
                <Label htmlFor="invoice">An Invoice Copy</Label>
                <Input
                  id="invoice"
                  type="file"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  onChange={(e) => setInvoice(e.target.files)}
                />
              </div>
              <div className="flex flex-col space-y-2 pb-2">
                <Label htmlFor="bankstmt">Bank Statement</Label>
                <Input
                  id="bankstmt"
                  type="file"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  onChange={(e) => setBankstmt(e.target.files)}
                />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col w-1/2 space-y-2 pb-2">
                <Label htmlFor="tinNumber">TIN Number</Label>
                <Input
                  id="tinNumber"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/2 space-y-2 pb-2">
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
            <div>
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
              <label htmlFor="walletaddress">Wallet Address:</label>
              <Input
                id="walletaddress"
                value={address}
                disabled
                className="bg-white text-black"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
