import React from 'react'
import Header from '../components/ui/header'
import InventoryItems from '../components/ui/inventoryItems'

function Page() {
  return (
    <div className='bg-[#fffbff] h-screen'>
        <Header/>
        <InventoryItems/>
    </div>
  )
}

export default Page