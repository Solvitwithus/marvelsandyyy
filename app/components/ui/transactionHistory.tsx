import React from 'react'

function TransactionHistory() {
  return (
    <div className='p-4'>
        <input type='text' placeholder='search transaction' className='w-72 border placeholder-black/30 pl-2 border-black/25 rounded '/>
        <p className='text-black font-extrabold tracking-wide'>Transaction History</p>
    </div>
  )
}

export default TransactionHistory