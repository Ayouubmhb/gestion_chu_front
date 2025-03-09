import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const BatimentContent = dynamic(() => import("@/components/BatimentContent"), {
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
    </div>
  ),
  ssr: false,
})

export default function BatimentPage() {
  return <BatimentContent />
}

