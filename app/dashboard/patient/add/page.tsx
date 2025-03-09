/* "use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

const situationsMedicales = ["Stable", "Critique", "En observation", "En rémission", "En traitement"]
const sections = ["Cardiologie", "Neurologie", "Pédiatrie", "Oncologie", "Urgences"]

export default function AddPatient() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    code: "",
    nom: "",
    prenom: "",
    situationMedicale: "",
    section: "",
  })

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

      <h1 className="text-2xl font-semibold mb-8">Ajouter un nouveau patient</h1>

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
          Ajouter
        </Button>
      </form>
    </div>
  )
}

 */

"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

const situationsMedicales = ["Stable", "Critique", "En observation", "En rémission", "En traitement"]

export default function AddPatient() {
  const router = useRouter()
  const [sections, setSections] = useState<{ id: number; nom: string }[]>([]) // ✅ Fetch sections from API
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    situationMedicale: "",
    sectionId: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Fetch sections from API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/sections")
        const data = await response.json()
        setSections(data)
      } catch (error) {
        console.error("❌ Error fetching sections:", error)
      }
    }
    fetchSections()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const patientData = {
      nom: formData.nom,
      prenom: formData.prenom,
      situationMedicale: formData.situationMedicale,
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/patients/create?sectionId=${formData.sectionId}`, // ✅ Send sectionId as query param
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patientData),
        }
      )

      if (!response.ok) throw new Error("❌ Failed to create patient")

      console.log("✅ Patient added successfully!")
      router.push("/dashboard/patient")
    } catch (error) {
      console.error("❌ Error adding patient:", error)
    } finally {
      setIsLoading(false)
    }
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

      <h1 className="text-2xl font-semibold mb-8">Ajouter un nouveau patient</h1>

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
          <Label htmlFor="sectionId">Section</Label>
          <Select onValueChange={handleSelectChange("sectionId")} value={formData.sectionId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.id} value={String(section.id)}>
                  {section.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-8"
          disabled={isLoading}
        >
          {isLoading ? "Ajout en cours..." : "Ajouter"}
        </Button>
      </form>
    </div>
  )
}