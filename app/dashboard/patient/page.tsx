import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const PatientContent = dynamic(() => import("@/components/PatientContent"), {
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
    </div>
  ),
  ssr: false,
})

export default function PatientPage() {
  return <PatientContent />
}

