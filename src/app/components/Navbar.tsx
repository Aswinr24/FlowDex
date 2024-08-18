import React from 'react'

export default function Navbar() {
  return (
    <nav className="bg-lime-700 py-2 shadow-xl fixed w-full bg-opacity-90">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center pl-16">
            <a
              href="/"
              className="text-xl font-bold text-amber-400 flex items-center"
            >
              <img src="./trade.png" className="w-8 h-8 mx-2" />
              FlowDex
            </a>
          </div>
          <div className="flex-1 flex pl-10 justify-center">
            <div className="flex space-x-20">
              <a
                href="/"
                className="text-yellow-500 inline-flex items-center text-lg font-bold hover:text-gray-700 transition duration-300 ease-in-out"
              >
                Home
              </a>
              <a
                href="/buyer"
                className="text-black inline-flex items-center text-lg font-bold hover:text-yellow-500 transition duration-300 ease-in-out"
              >
                Buy
              </a>
              <a
                href="/seller"
                className="text-black inline-flex items-center text-lg font-bold hover:text-yellow-500 transition duration-300 ease-in-out"
              >
                Sell
              </a>
            </div>
          </div>
          <div className="flex items-center mr-10" style={{ width: '240px' }}>
            <w3m-button />
          </div>
        </div>
      </div>
    </nav>
  )
}
