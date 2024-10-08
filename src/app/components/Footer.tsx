import React from 'react'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <main className="bg-lime-400 opacity-80 text-black">
      <div className="p-10">
        <div className="grid grid-cols-3">
          <div className="flex-row px-10">
            <div className="flex text-2xl font-semibold">
              <img src="./trade.png" className="w-8 h-8 mx-2" />
              FlowDex
            </div>
            <div className="flex text-md mt-4">
              Simplifying finance supply chains with secure, efficient
              transactions and streamlined processes.
            </div>
          </div>
          <div></div>
          <div className="px-10 flex justify-end">
            <a
              href="https://github.com/Aswinr24/FlowDex"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="w-10 h-10 cursor-pointer text-lime-800 hover:text-lime-900" />
            </a>
          </div>
        </div>
      </div>
      <hr className="my-1 mx-20 border-stone-700" />
      <span className="block text-center pb-2 text-sm text-black opacity-80">
        Flowdex-2024
      </span>
    </main>
  )
}

export default Footer
