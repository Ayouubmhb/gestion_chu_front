/* "use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

// Mock data for doctors
const doctors = [
  "Dr. Smith",
  "Dr. Johnson",
  "Dr. Williams",
  "Dr. Brown",
  "Dr. Jones",
  "Dr. Garcia",
  "Dr. Miller",
  "Dr. Davis",
  "Dr. Rodriguez",
  "Dr. Martinez",
]

// Mock function to fetch section data
const fetchSectionData = async (id: string) => {
  // In a real application, this would be an API call
  return {
    id,
    section: `Section ${id}`,
    description: `Description de la section ${id}`,
    affecteA: doctors.slice(0, Math.floor(Math.random() * 3) + 1), // Randomly assign 1-3 doctors
  }
}

export default function EditSection({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    section: "",
    description: "",
    affecteA: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSectionData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchSectionData(params.id)
        setFormData(data)
      } catch (error) {
        console.error("Failed to fetch section data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSectionData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = (doctor: string, isChecked: boolean) => {
    if (isChecked) {
      setFormData({ ...formData, affecteA: [...formData.affecteA, doctor] })
    } else {
      setFormData({ ...formData, affecteA: formData.affecteA.filter((d) => d !== doctor) })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    router.push("/dashboard/sections")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/sections")}
        className="mb-6 -ml-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-2xl font-semibold mb-8">Modifier la section</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <Input
            id="section"
            name="section"
            required
            value={formData.section}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Affecté à</Label>
          <div className="space-y-2 mt-2 border rounded-lg p-4">
            {doctors.map((doctor) => (
              <div key={doctor} className="flex items-center">
                <Checkbox
                  id={doctor}
                  checked={formData.affecteA.includes(doctor)}
                  onCheckedChange={(checked) => handleCheckboxChange(doctor, checked as boolean)}
                />
                <label
                  htmlFor={doctor}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {doctor}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-8">
          Modifier
        </Button>
      </form>
    </div>
  )
}

 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

interface Doctor {
  id: number
  nom: string
  prenom: string
}

export default function EditSection({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [doctors, setDoctors] = useState<Doctor[]>([]) // ✅ Fetch real doctors
  const [formData, setFormData] = useState({
    section: "",
    description: "",
    affecteA: [] as number[], // ✅ Store selected doctor IDs
  })
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Fetch section data and doctors on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // ✅ Fetch section details
        const sectionRes = await fetch(`http://localhost:8080/api/sections/${params.id}`)
        const sectionData = await sectionRes.json()

        // ✅ Fetch all available doctors
        const doctorsRes = await fetch("http://localhost:8080/api/personnels/doctors")
        const doctorsData = await doctorsRes.json()

        setDoctors(doctorsData) // ✅ Store all doctors

        // ✅ Populate form with fetched section data
        setFormData({
          section: sectionData.nom,
          description: sectionData.description,
          affecteA: sectionData.personnels.map((doctor: Doctor) => doctor.id), // ✅ Store assigned doctors
        })
      } catch (error) {
        console.error("❌ Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ✅ Handle checkbox selection (add/remove doctor ID)
  const handleCheckboxChange = (doctorId: number, isChecked: boolean) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      affecteA: isChecked
        ? [...prevFormData.affecteA, doctorId] // ✅ Add doctor ID if checked
        : prevFormData.affecteA.filter((id) => id !== doctorId), // ✅ Remove doctor ID if unchecked
    }))
  }  

  // ✅ Submit form (send updated section + assigned doctors)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const sectionData = {
      nom: formData.section,
      description: formData.description,
    }

    console.log("🚀 Sending Data:", { sectionData, selectedDoctors: formData.affecteA })

    try {
      const response = await fetch(
        `http://localhost:8080/api/sections/update/${params.id}?personnelsIds=${formData.affecteA.join(",")}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionData),
        }
      )

      if (!response.ok) throw new Error("❌ Failed to update section")

      console.log("✅ Section updated successfully")
      router.push("/dashboard/sections")
    } catch (error) {
      console.error("❌ Error updating section:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/sections")}
        className="mb-6 -ml-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-2xl font-semibold mb-8">Modifier la section</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <Input
            id="section"
            name="section"
            required
            value={formData.section}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Affecté à</Label>
          <div className="space-y-2 mt-2 border rounded-lg p-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="flex items-center">
                <Checkbox
                  id={doctor.id.toString()}
                  checked={formData.affecteA.includes(doctor.id)} // ✅ Use ID for comparison
                  onCheckedChange={(checked) => handleCheckboxChange(doctor.id, checked as boolean)}
                />
                <label
                  htmlFor={`doctor-${doctor.id}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {doctor.nom} {doctor.prenom}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-8">
          Modifier
        </Button>
      </form>
    </div>
  )
}