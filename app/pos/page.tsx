import React from 'react'
import Header from '../components/ui/header'
import PosRightsection from '../components/ui/posRightsection'
import TransactionHistory from '../components/ui/transactionHistory'
import PosHandler from '../components/ui/posHandler'
import AllItems from '../components/ui/allitems'

function Page() {
  return (
    <div className='bg-[#fffbff] h-screen w-fit'>
      <Header/>
      <AllItems/>
      <div className='flex w-screen'>
      <TransactionHistory/>
    <PosHandler/>
    <PosRightsection/>
    </div>
    </div>
  )
}

export default Page