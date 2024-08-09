'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleButtonClick = (path: string) => {
    router.push(path)
    setIsOpen(false) // Close the sidebar after navigation
  }

  const buttonClass = (path: string) =>
    `py-2 mb-4 px-4 text-lg rounded-lg ${
      pathname === path ? 'bg-lime-500' : 'hover:bg-lime-500'
    }`

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 left-8 z-10 bg-lime-600 text-white p-3 rounded-full shadow-md hover:bg-lime-700 transition"
      >
        <HiMenu size={24} />
      </button>

      <div
        className={`fixed top-20 left-0 h-full font-bold w-48 bg-lime-300 text-black transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-20`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-2xl text-lime-800"
        >
          <HiX />
        </button>
        <div className="flex flex-col mt-16 px-4">
          <button
            onClick={() => handleButtonClick('/buyer')}
            className={buttonClass('/buyer')}
          >
            Explore Sellers
          </button>
          <button
            onClick={() => handleButtonClick('/buyer/orders')}
            className={buttonClass('/buyer/orders')}
          >
            View Orders
          </button>
          <button
            onClick={() => handleButtonClick('/buyer/history')}
            className={buttonClass('/buyer/history')}
          >
            Order History
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
