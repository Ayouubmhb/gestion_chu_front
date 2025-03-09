"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

const fonctionnalites = ["Urgence", "Chirurgie", "Radiologie", "Administration"]

// Define the type for Batiment
interface Batiment {
  id: number;
  nom: string;
  emplacement: string;
  taille: string;
  fonctionnalite: string;
  description: string;
}

// Mock function to fetch batiment data
const fetchBatimentData = async (id: string) => {
  // In a real application, this would be an API call
  const response = await fetch(`http://localhost:8080/api/batiments/${id}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch batiment data");
  }

  const data = await response.json();
  return data; // ✅ Return only the data object
}

export default function EditBatiment({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: params.id,
    nom: "",
    taille: "",
    emplacement: "",
    fonctionnalite: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBatimentData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchBatimentData(params.id)
        setFormData(data)
      } catch (error) {
        console.error("Failed to fetch batiment data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadBatimentData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, fonctionnalite: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:8080/api/batiments/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update Batiment");

      console.log("Batiment updated successfully!");
      router.push("/dashboard/batiment"); // ✅ Redirect to the dashboard
    } catch (error) {
      console.error("Error updating Batiment:", error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
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

      <h1 className="text-2xl font-semibold mb-8">Modifier le bâtiment</h1>

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
          Modifier
        </Button>
      </form>
    </div>
  )
}

