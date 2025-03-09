"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { DashboardLoader } from "@/components/DashboardLoader"

const ServiceContent = dynamic(() => import("@/components/ServiceContent"), {
  loading: () => <DashboardLoader />,
  ssr: false,
})

export default function ServicePage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <ServiceContent />
    </Suspense>
  )
}

