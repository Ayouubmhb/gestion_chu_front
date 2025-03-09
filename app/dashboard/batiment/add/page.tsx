"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

const fonctionnalites = ["Urgence", "Chirurgie", "Radiologie", "Administration"]

export default function AddBatiment() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: "",
    taille: "",
    emplacement: "",
    fonctionnalite: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, fonctionnalite: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const type = formData.fonctionnalite.toLowerCase();
    
    const response = await fetch(`http://localhost:8080/api/batiments/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          ...formData,
          fonctionnalite: type,
      })
    });

    const data = await response.json();
    console.log("Bâtiment créé :", data);
    router.push("/dashboard/batiment")
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/batiment")}
        className="mb-6 -ml-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-2xl font-semibold mb-8">Ajouter un nouveau bâtiment</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="batiment">Bâtiment</Label>
          <Input
            id="batiment"
            name="nom"
            required
            value={formData.nom}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taille">Taille</Label>
          <Input
            id="taille"
            name="taille"
            required
            value={formData.taille}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emplacement">Emplacement</Label>
          <Input
            id="emplacement"
            name="emplacement"
            required
            value={formData.emplacement}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fonctionnalite">Fonctionnalité</Label>
          <Select onValueChange={handleSelectChange} value={formData.fonctionnalite}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une fonctionnalité" />
            </SelectTrigger>
            <SelectContent>
              {fonctionnalites.map((fonctionnalite) => (
                <SelectItem key={fonctionnalite} value={fonctionnalite}>
                  {fonctionnalite}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-8">
          Ajouter
        </Button>
      </form>
    </div>
  )
}

