"use client"

import type React from "react"

import { Users, LogOut, Menu, Activity, Building2, Building, UserRound, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useSidebar } from "@/contexts/SidebarContext"

export function Sidenav() {
  const router = useRouter()
  const pathname = usePathname()
  const { isSidebarOpen, toggleSidebar, isMobile } = useSidebar()

  const handleLogout = () => {
    router.push("/login")
  }

  const linkClass = (isActive: boolean) => `
    w-full flex items-center gap-3 text-white 
    ${isActive ? "bg-[#2A3642] !text-green-500" : "hover:bg-[#2A3642] hover:text-green-500"} 
    px-4 py-2 rounded-md transition-all duration-300 ease-in-out
  `

  const deconnectBtnClass = (isActive: boolean) => `
  w-full flex items-center gap-3 text-white 
  ${isActive ? "bg-[#F90B31]" : "hover:bg-[#F90B31]"} 
  px-4 py-2 rounded-md transition-all duration-300 ease-in-out
`

  const NavLink = ({
    href,
    icon: Icon,
    children,
  }: { href: string; icon: React.ElementType; children: React.ReactNode }) => (
    <Link href={href} className={linkClass(pathname === href)}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      {isSidebarOpen && <span className="text-sm font-medium">{children}</span>}
    </Link>
  )

  return (
    <div
      className={`
        fixed inset-y-0 z-50 bg-[#1D262D] transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-64" : "w-16"}
        ${isMobile ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
      `}
    >
      <div className="flex h-14 items-center border-b border-[#2A3642] px-4">
        {isSidebarOpen && (
          <div className="flex items-center flex-1">
            <Activity className="h-6 w-6 text-white mr-2" />
            <span className="font-semibold text-white text-lg">Gestion CHU</span>
          </div>
        )}
        <Button variant="ghost" size="icon" className="text-white hover:bg-[#2A3642] ml-auto" onClick={toggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col justify-between h-[calc(100vh-3.5rem)] py-4">
        <nav className="space-y-1 px-2">
          <NavLink href="/dashboard" icon={Users}>
            Personnels
          </NavLink>
          <NavLink href="/dashboard/service" icon={Building2}>
            Services
          </NavLink>
          <NavLink href="/dashboard/batiment" icon={Building}>
            Bâtiments
          </NavLink>
          <NavLink href="/dashboard/patient" icon={UserRound}>
            Patients
          </NavLink>
          <NavLink href="/dashboard/sections" icon={Layers}>
            Sections
          </NavLink>
        </nav>
        <div className="px-2">
          <button className={deconnectBtnClass(false)} onClick={handleLogout}>
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">Se déconnecter</span>}
          </button>
        </div>
      </div>
    </div>
  )
}