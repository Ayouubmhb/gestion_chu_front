import dynamic from "next/dynamic"
import { DashboardLoader } from "@/components/DashboardLoader"

const SectionsContent = dynamic(() => import("@/components/SectionsContent"), {
  loading: () => <DashboardLoader />,
  ssr: false,
})

export default function SectionsPage() {
  return <SectionsContent />
}

