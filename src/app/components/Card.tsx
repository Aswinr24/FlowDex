'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BuyerRegisterPopup from './BuyerRegisterPopup'
import SellerRegisterPopup from './SellerRegisterPopup'
import RegulatorRegisterPopup from './RegulatorRegisterPopup'

interface CardCompProps {
  type: 'buyer' | 'seller' | 'regulator' | 'financier' | 'logistics'
}

export function CardComp({ type }: CardCompProps) {
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [name, setName] = useState('')
  const isBuyerPopup = type === 'buyer'
  const isSellerPopup = type === 'seller'
  const handleRegisterClick = () => {
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <Card className="w-[350px] rounded-3xl bg-lime-200 border border-lime-600 ">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {type === 'buyer'
            ? 'I am here'
            : type === 'seller'
            ? 'I am here'
            : type === 'financier'
            ? 'I am here'
            : type === 'logistics'
            ? 'I am here'
            : 'Regulatory Body'}
        </CardTitle>
        <CardDescription className="text-center text-xl text-yellow-500 font-semibold">
          {type === 'buyer'
            ? 'to BUY'
            : type === 'seller'
            ? 'to SELL'
            : type === 'financier'
            ? 'to provide FINANCE'
            : type === 'logistics'
            ? 'to provider LOGISTICS'
            : 'to regulate and resolve disputes'}
        </CardDescription>
        <div className="flex-row items-center justify-center px-24 pt-4">
          {type === 'buyer' ? (
            <img src="./buyer.png" className="w-28 h-24" />
          ) : type === 'seller' ? (
            <img src="./seller.png" className="w-28 h-24" />
          ) : (
            <img src="./regulator.png" className="mt-6 w-28 h-24" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            {(isBuyerPopup || isSellerPopup) && (
              <div className="flex flex-col space-y-1.5">
                <Label
                  htmlFor="framework"
                  className="px-4 py-2 text-amber-600 text-center"
                >
                  Name Of Your Business
                </Label>
                <Input
                  id="name"
                  className="px-2 w-[280px] mx-3 bg-lime-100 border-lime-300 border-2 rounded-xl"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <Button
          className="bg-yellow-500 hover:bg-amber-500"
          onClick={handleRegisterClick}
        >
          {type === 'buyer'
            ? 'Register as a Buyer!'
            : type === 'seller'
            ? 'Register as a Seller!'
            : type === 'financier'
            ? 'Register as a Financier'
            : 'Register'}
        </Button>
      </CardFooter>
      {showPopup &&
        (isBuyerPopup ? (
          <BuyerRegisterPopup
            nameOfBusiness={name}
            onClose={handleClosePopup}
          />
        ) : isSellerPopup ? (
          <SellerRegisterPopup
            nameOfBusiness={name}
            onClose={handleClosePopup}
          />
        ) : (
          <RegulatorRegisterPopup onClose={handleClosePopup} />
        ))}
    </Card>
  )
}
