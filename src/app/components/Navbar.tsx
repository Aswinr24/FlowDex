import React from 'react'

export default function Navbar() {
  return (
    <nav className="bg-lime-700 py-2 shadow-xl fixed w-full bg-opacity-90">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex mx-6 justify-between items-center h-16">
          <div className="flex items-center pl-16">
            <a href="/" className="text-xl font-bold text-black">
              CrediFlow
            </a>
          </div>
          <div className="flex-1 flex justify-center ml-10">
            <div className="flex space-x-20">
              <a
                href="/"
                className="text-yellow-600 inline-flex items-center text-lg font-medium hover:text-gray-700 transition duration-300 ease-in-out"
              >
                Home
              </a>
              <a
                href="/issuer"
                className="text-black inline-flex items-center text-lg font-medium hover:text-gray-700 transition duration-300 ease-in-out"
              >
                Buy
              </a>
              <a
                href="/student"
                className="text-black inline-flex items-center text-lg font-medium hover:text-gray-700 transition duration-300 ease-in-out"
              >
                Sell
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <w3m-button />
          </div>
        </div>
      </div>
    </nav>
  )
}
