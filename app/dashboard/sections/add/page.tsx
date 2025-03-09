/* "use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

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

export default function AddSection() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    section: "",
    description: "",
    affecteA: [] as string[],
  })

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

      <h1 className="text-2xl font-semibold mb-8">Ajouter une nouvelle section</h1>

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
          Ajouter
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

export default function AddSection() {
  const router = useRouter()
  const [doctors, setDoctors] = useState<Doctor[]>([]) // ✅ Fetch doctors dynamically
  const [formData, setFormData] = useState({
    section: "",
    description: "",
    affecteA: [] as number[], // ✅ Store selected doctor IDs
  })

  // ✅ Fetch available doctors on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/personnels/doctors")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDoctors(data) // ✅ Set only if it's an array
        } else {
          console.error("❌ API returned invalid data:", data)
          setDoctors([]) // ✅ Fallback to an empty array
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching doctors:", error)
        setDoctors([]) // ✅ Ensure doctors is never undefined
      })
  }, [])

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ✅ Handle checkbox selection (adding/removing doctor IDs)
  const handleCheckboxChange = (doctorId: number, isChecked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      affecteA: isChecked
        ? [...prev.affecteA, doctorId] // ✅ Add selected doctor ID
        : prev.affecteA.filter((id) => id !== doctorId), // ✅ Remove if unchecked
    }))
  }

  // ✅ Submit form (send section data with selected doctor IDs)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const sectionData = {
      nom: formData.section,
      description: formData.description,
    }

    console.log("🚀 Sending Data:", { sectionData, selectedDoctors: formData.affecteA })

    try {
      const response = await fetch(
        `http://localhost:8080/api/sections/create?personnelsIds=${formData.affecteA.join(",")}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionData),
        }
      )

      if (!response.ok) throw new Error("Failed to create section")

      console.log("✅ Section created successfully")
      router.push("/dashboard/sections")
    } catch (error) {
      console.error("❌ Error creating section:", error)
    }
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

      <h1 className="text-2xl font-semibold mb-8">Ajouter une nouvelle section</h1>

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
                  id={`doctor-${doctor.id}`}
                  checked={formData.affecteA.includes(doctor.id)}
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
          Ajouter
        </Button>
      </form>
    </div>
  )
}