import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems';


const Sidebar = ({sideBarOpen,setSideBarOpen}) => {
  const navigate  = useNavigate();
  return (
    <div classname={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${sideBarOpen?'translate-x-0':'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
      <div className='w-full'>
        <img onClick={()=> Navigate('/')} src={assets.logo} alt="" className='w-26 ml-7 my-2 cursor-pointer'/>
        <hr className='border-gray-300 mb-8' />

        <MenuItems setSideBarOpen={setSideBarOpen}/>
      </div>
    </div>
  )
}

export default Sidebar