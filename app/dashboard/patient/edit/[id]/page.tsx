/* "use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

const situationsMedicales = ["Stable", "Critique", "En observation", "En rémission", "En traitement"]
const sections = ["Cardiologie", "Neurologie", "Pédiatrie", "Oncologie", "Urgences"]

// Mock function to fetch patient data
const fetchPatientData = async (id: string) => {
  // In a real application, this would be an API call
  return {
    id,
    code: `P${id.padStart(5, "0")}`,
    nom: `Nom${id}`,
    prenom: `Prénom${id}`,
    situationMedicale: situationsMedicales[Math.floor(Math.random() * situationsMedicales.length)],
    section: sections[Math.floor(Math.random() * sections.length)],
  }
}

export default function EditPatient({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    code: "",
    nom: "",
    prenom: "",
    situationMedicale: "",
    section: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPatientData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchPatientData(params.id)
        setFormData(data)
      } catch (error) {
        console.error("Failed to fetch patient data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPatientData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    router.push("/dashboard/patient")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/patient")}
        className="mb-6 -ml-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-2xl font-semibold mb-8">Modifier le patient</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" required value={formData.code} onChange={handleChange} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" name="nom" required value={formData.nom} onChange={handleChange} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input
            id="prenom"
            name="prenom"
            required
            value={formData.prenom}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="situationMedicale">Situation médicale</Label>
          <Select onValueChange={handleSelectChange("situationMedicale")} value={formData.situationMedicale}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une situation médicale" />
            </SelectTrigger>
            <SelectContent>
              {situationsMedicales.map((situation) => (
                <SelectItem key={situation} value={situation}>
                  {situation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <Select onValueChange={handleSelectChange("section")} value={formData.section}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

const situationsMedicales = ["Stable", "Critique", "En observation", "En rémission", "En traitement"]

export default function EditPatient({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: "",
    nom: "",
    prenom: "",
    situationMedicale: "",
    section: "",
  })
  const [sections, setSections] = useState<{ id: number; nom: string }[]>([]) // ✅ Holds real sections from API
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Fetch Patient & Sections Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch patient
        const patientRes = await fetch(`http://localhost:8080/api/patients/${params.id}`)
        const patientData = await patientRes.json()

        // Fetch sections
        const sectionsRes = await fetch("http://localhost:8080/api/sections")
        const sectionsData = await sectionsRes.json()

        setSections(sectionsData) // ✅ Set available sections
        setFormData({
          id: patientData.id,
          nom: patientData.nom,
          prenom: patientData.prenom,
          situationMedicale: patientData.situationMedicale,
          section: patientData.section ? patientData.section.id.toString() : "", // ✅ Store section ID as string
        })
      } catch (error) {
        console.error("❌ Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ✅ Handle Select Change
  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  // ✅ Handle Form Submit (Update Patient)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedPatient = {
      id: formData.id,
      nom: formData.nom,
      prenom: formData.prenom,
      situationMedicale: formData.situationMedicale,
      sectionId: formData.section !== "" ? Number(formData.section) : null, // ✅ Convert to number
    }

    console.log(updatedPatient)

    try {
      const response = await fetch(`http://localhost:8080/api/patients/update/${updatedPatient.sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPatient),
      })

      if (!response.ok) throw new Error("❌ Failed to update patient")

      console.log("✅ Patient updated successfully")
      router.push("/dashboard/patient")
    } catch (error) {
      console.error("❌ Error updating patient:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/patient")}
        className="mb-6 -ml-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-2xl font-semibold mb-8">Modifier le patient</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" name="nom" required value={formData.nom} onChange={handleChange} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" name="prenom" required value={formData.prenom} onChange={handleChange} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="situationMedicale">Situation médicale</Label>
          <Select onValueChange={handleSelectChange("situationMedicale")} value={formData.situationMedicale}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une situation médicale" />
            </SelectTrigger>
            <SelectContent>
              {situationsMedicales.map((situation) => (
                <SelectItem key={situation} value={situation}>
                  {situation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <Select onValueChange={handleSelectChange("section")} value={formData.section}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id.toString()}>
                  {section.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-8">
          Modifier
        </Button>
      </form>
    </div>
  )
}