"use client"

import React from 'react'
import Navbar from '@/app/(components)/Navbar/index'
import Sidebar from './(components)/Sidebar'
import StoreProvider, { useAppSelector } from './redux'

const DashboardLayout = ({ children}: {children: React.ReactNode} ) => {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  return (
    <div className={`flex bg-neutral-900 text-gray-100 w-full min-h-screen`}>     
      <Sidebar />
      <main className={`flex flex-col w-full h-full py-7 px-9 bg-neutral-900 ${isSidebarCollapsed ? "md:pl-24" : "md:pl-72"}`}>
        <Navbar />
        {children}
      </main>
    </div>
  )
}

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </StoreProvider>
  )  
}

export default DashboardWrapper
