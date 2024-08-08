import React from 'react'
import { CardComp } from './Card'
const Body = () => {
  return (
    <main>
      <main className="flex items-center justify-center h-[70vh] pt-20">
        <div className="h-1/3 items-center justify-center">
          <h1 className="text-transparent pb-2 items-center text-center justify-center bg-clip-text bg-gradient-to-r from-yellow-400 to-lime-800 text-4xl font-semibold">
            Building Trust, Driving Trade, Simplifying Finance
          </h1>
          <div className="flex items-center justify-center lg:mx-80 lg:pl-2">
            <h3 className="my-2 text-md text-yellow-500">
              CrediFlow is a decentralized platform designed to simplify and
              secure transactions between buyers and suppliers. By leveraging
              blockchain technology, it enhances transparency, reduces fraud,
              and automates key processes such as purchase ordering, dynamic
              discounting, and inventory-based financing.
            </h3>
          </div>
        </div>
      </main>
      <div className="flex px-36 gap-20 pb-20">
        <CardComp type="buyer" />
        <CardComp type="seller" />
        <CardComp type="regulator" />
      </div>
    </main>
  )
}

export default Body
