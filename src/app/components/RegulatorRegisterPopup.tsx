import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAccount } from 'wagmi'
import { useToast } from '@/components/ui/use-toast'

interface RegulatorRegisterPopupProps {
  onClose: () => void
}
const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT1_ADDRESS as CryptoAddress
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

export default function RegulatorRegisterPopup({
  onClose,
}: RegulatorRegisterPopupProps) {
  const [name, setName] = useState<string>('')
  const [documents, setDocuments] = useState<FileList | null>(null)
  const [cashFlow, setCashFlow] = useState<FileList | null>(null)
  const [phoneno, setPhoneno] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const { address, isConnecting, isDisconnected } = useAccount()
  const { toast } = useToast()

  const handleSubmit = () => {
    // Implement the form submission logic here
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-yellow-200 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Register as a Regulator</h2>
        <form>
          <div className="space-y-4 text-sm">
            <div>
              <label htmlFor="Name">Name:</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name of the institution"
                className="text-black mt-2 bg-yellow-50 border-yellow-300"
              />
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col w-1/2 space-y-2 pb-2 text-sm">
                <label htmlFor="phoneno">Phone no:</label>
                <Input
                  id="phoneno"
                  value={phoneno}
                  onChange={(e) => setPhoneno(e.target.value)}
                  placeholder="+91 "
                  className="text-black bg-yellow-50 border-yellow-300"
                />
              </div>
              <div className="flex flex-col w-1/2 space-y-2 text-sm">
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
                <Label htmlFor="license">Contract / Agreement / License </Label>
                <Input
                  id="license"
                  type="file"
                  className="mt-1 bg-yellow-50 border-yellow-300"
                  onChange={(e) => setCashFlow(e.target.files)}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2 text-sm">
              <label htmlFor="walletaddress">Wallet Address:</label>
              <Input
                id="walletaddress"
                value={address}
                readOnly
                className="bg-yellow-100 text-gray-600 border-yellow-300"
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
