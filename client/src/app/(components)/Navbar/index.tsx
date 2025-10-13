"use client"

import { useAppDispatch, useAppSelector } from '@/app/redux'
import { setIsSidebarCollapsed } from '@/state'
import { Bell, Menu, Search, Settings, Sun } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  const dispatch = useAppDispatch()
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  
    const toggleSidebar = () => {
      dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    }

  return (
    <div className='flex justify-between items-center w-full mb-7'>
      <div className='flex justify-between items-center gap-5'>
        <button className='px-3 py-3 bg-neutral-800 rounded-full hover:bg-neutral-700' onClick={toggleSidebar} >
          <Menu className='w-4 h-4' />
        </button>

        <div className='relative'>
          <input type='search' placeholder='Busca grupos y productos' 
            className='pl-10 pr-4 py-2 w-50 md:w-80 border-2 border-neutral-800 bg-black rounded-lg focus:outline-none focus:border-neutral-700'
          />

          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='text-neutral-500' size={20} />
          </div>
        </div>
      </div>


      <div className='flex justify-between items-center gap-5'>
        <div className='hidden md:flex justify-between items-center gap-5'>
          <div className='relative'>
            <Bell className='cursor-pointer text-neutral-500' size={24}/>
            <span className='absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full'>
              3
            </span>
          </div>
          <hr className='border-neutral-800 h-7 w-0 border-solid border-l mx-3' />
          <div>
            <div className='flex items-center gap-3 cursor-pointer'>
              <div className='w-9 h-9'>
                image
              </div>
              <span className='font-semibold'>Yoo</span>
            </div>
          </div>
        </div>
          <Link href="/settings">
            <Settings className='cursor-pointer text-neutral-500' size={24}/>
          </Link>
      </div>
    </div>
  )
}

export default Navbar
