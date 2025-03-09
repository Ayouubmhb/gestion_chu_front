"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { DashboardLoader } from "@/components/DashboardLoader"

const DashboardContent = dynamic(() => import("@/components/DashboardContent"), {
  loading: () => <DashboardLoader />,
  ssr: false,
})

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <DashboardContent />
    </Suspense>
  )
}

