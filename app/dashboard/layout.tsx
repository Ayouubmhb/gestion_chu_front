"use client"

import React from "react"
import { Header } from "@/components/Header"
import { Sidenav } from "@/components/Sidenav"
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext"

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useSidebar()
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleSearch = (term: string) => {
    // This function will be passed down to the children components
    // We'll use React.cloneElement to pass it as a prop
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { searchTerm, onSearch: handleSearch })
    }
    return child
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidenav />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:pl-64" : "lg:pl-16"}`}
      >
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
        <main className="flex-1 p-6 overflow-auto">{childrenWithProps}</main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  )
}

