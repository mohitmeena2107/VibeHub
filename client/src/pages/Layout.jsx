import { Menu,  X } from 'lucide-react'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import {dummyUserData} from '../assets/assets'
import Sidebar from '../components/Sidebar'
import {Loading} from '../components/Loading'
import { useSelector } from 'react-redux'

const Layout = () => {
  const user = useSelector((state)=>state.user.value);
  // console.log(user)
  const [sideBarOpen,setSideBarOpen] = useState(true)

  return user? (
    <div className='w-full flex h-screen'>

      <Sidebar sideBarOpen = {sideBarOpen} setSideBarOpen={setSideBarOpen}/>

      <div className='flex-1 bg-slate-50'>
        <Outlet/>
      </div>
      {
        sideBarOpen?
        <X className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=>setSideBarOpen(false)} />:
        <Menu className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=>setSideBarOpen(true)}/>
      }
    </div>
  ):(
    <Loading/>
  )
}

export default Layout