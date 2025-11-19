"use client"
import React from 'react'

function Itemstable() {
  return (
  
      <div className="mt-5">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f3f4f6] text-[#7c7c7c] text-[0.9rem]">
              <th className="text-left p-2">Product</th>
              <th className="text-left p-2">Quantity</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
        </table>
      </div>
  )
}

export default Itemstable