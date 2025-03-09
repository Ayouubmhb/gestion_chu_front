"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

const fonctions = ["Administrateur", "Médecin", "Infirmier", "Agent d'aide", "Directeur"]

export default function AddPersonnel() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    fonction: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      console.log(formData);
      
      const response = await fetch(`http://localhost:8080/api/personnels/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            formData,
        )
      });
  
      const data = await response.json();
      console.log("Personnel créé :", data);
      router.push("/dashboard")
    }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="mb-6 -ml-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-2xl font-semibold mb-8">Ajouter un nouveau personnel</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            name="telephone"
            required
            value={formData.telephone}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fonction">Fonction</Label>
          <Select onValueChange={handleSelectChange("fonction")} value={formData.fonction}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une fonction" />
            </SelectTrigger>
            <SelectContent>
              {fonctions.map((fonction) => (
                <SelectItem key={fonction} value={fonction}>
                  {fonction}
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

