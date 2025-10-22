"use client"

import { useAppDispatch, useAppSelector } from '@/app/redux'
import { setIsSidebarCollapsed } from '@/state'
import {  Menu, Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

const Navbar = () => {
  const [searchData, setSearchData] = useState("")
  const dispatch = useAppDispatch()
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const router = useRouter()
  const pathname = usePathname()
  const searchDisabled = pathname === '/products'
  
  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchData(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // evita que se recargue la página
      if (searchData.trim() !== '') {
        router.push(`/products?search=${encodeURIComponent(searchData)}`);
        setSearchData("")
      }
    }
  };

  return (
    <div className='flex justify-between items-center w-full mb-7'>
      <div className='flex justify-between items-center gap-5'>
        <button className='px-3 py-3 bg-neutral-800 rounded-full hover:bg-neutral-700' onClick={toggleSidebar} >
          <Menu className='w-4 h-4' />
        </button>

        <div className='relative'>
          <input type='search' placeholder='Busca grupos y productos' 
            className={`pl-10 pr-4 py-2 w-50 md:w-80 border-2 border-neutral-800 bg-black rounded-lg focus:outline-none focus:border-neutral-700 ${searchDisabled ? "opacity-50" : "" }`}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={searchDisabled}
          />

          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='text-neutral-500' size={20} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
