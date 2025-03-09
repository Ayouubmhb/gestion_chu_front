"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

const fonctions = ["Administrateur", "Médecin", "Infirmier", "Agent d'aide"]
const services = ["Services médicaux", "Services paramédicaux", "Urgence", "Analyse", "Radiologie", "Techniques"]

export default function AddPersonnel() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    identifiant: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    fonction: "",
    service: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
    // After successful submission, redirect to the dashboard
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto p-6">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-2xl font-semibold mb-6">Ajouter un nouveau personnel</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="identifiant">Identifiant</Label>
          <Input id="identifiant" name="identifiant" required value={formData.identifiant} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" name="nom" required value={formData.nom} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" name="prenom" required value={formData.prenom} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" name="telephone" required value={formData.telephone} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="fonction">Fonction</Label>
          <Select onValueChange={handleSelectChange("fonction")} value={formData.fonction}>
            <SelectTrigger>
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
        <div>
          <Label htmlFor="service">Service</Label>
          <Select onValueChange={handleSelectChange("service")} value={formData.service}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
          Soumettre
        </Button>
      </form>
    </div>
  )
}

