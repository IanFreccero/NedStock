"use client"
import { useAppDispatch, useAppSelector } from '@/app/redux'
import { setIsSidebarCollapsed } from '@/state'
import { Archive, CircleDollarSign, Clipboard, Layout, LucideIcon, Menu, SlidersHorizontal, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed
}: SidebarLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard")

  return (
    <Link href={href}>
      <div className={`cursor-pointer flex items-center 
        ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"}
         hover:bg-neutral-800/70 gap-3 transition-colors ${isActive ? "bg-neutral-800 font-bold" : ""}`}>
          <Icon className='size-6'/>
          <span className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-100`}>
            {label}
          </span>
      </div>
    </Link>
  )
}

const Sidebar = () => {
  const dispatch = useAppDispatch()
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  }

  const sidebarClassNames = `fixed flex flex-col 
  ${isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"}
  bg-black transition-all duration-200 overflow-hidden h-full z-40 shadow-md`;

  return (
    <div className={sidebarClassNames}>
      {/* Top Logo */}
      <div className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${isSidebarCollapsed ? "px-2" : "px-8"}`}>
        <img src={`/nedStockLogo.png`} className='size-12'></img>
        <h1 className={`font-extrabold text-2xl ${isSidebarCollapsed ? "hidden" : "block"} `}>NedStock</h1>
        <button className='md:hidden px-3 py-3 rounded-lg hover:bg-neutral-700'
          onClick={toggleSidebar}
          >
          <Menu className='size-4'/>
        </button>
      </div>

      {/* Links */}
      <div className='flex-grow mt-8'>
        <SidebarLink href="/dashboard" icon={Layout} label="Dashboard" isCollapsed={isSidebarCollapsed}/>
        <SidebarLink href="/inventory" icon={Archive} label="Inventory" isCollapsed={isSidebarCollapsed}/>
        <SidebarLink href="/products" icon={Clipboard} label="Products" isCollapsed={isSidebarCollapsed}/>
        <SidebarLink href="/users" icon={User} label="Users" isCollapsed={isSidebarCollapsed}/>
        <SidebarLink href="/settings" icon={SlidersHorizontal} label="Settings" isCollapsed={isSidebarCollapsed}/>
        <SidebarLink href="/expenses" icon={CircleDollarSign} label="Expenses" isCollapsed={isSidebarCollapsed}/>
      </div>
      {/* Footer */}
      <div>
        <p className={`text-center text-xs text-gray-100 ${isSidebarCollapsed ? "hidden" : "block"} mb-4`}>
          &copy; 2025 NedStock
        </p>
      </div>
    </div>
  )
}

export default Sidebar