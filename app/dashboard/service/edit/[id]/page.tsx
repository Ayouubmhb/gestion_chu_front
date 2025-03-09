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

const batiments = [
  "Administration",
  "Laboratoires",
  "Radiologie",
  "Urgence",
  "Médecine générale",
  "Spécialités médicales",
  "Chirurgie",
]

interface Service {
  id: number;
  nom: string;
  description: string;
}

const fetchServiceData = async (id: string) => {
  // In a real application, this would be an API call
  const response = await fetch(`http://localhost:8080/api/services/${id}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch service data");
  }

  const data = await response.json();
  return data; // ✅ Return only the data object
}

export default function EditService({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: "",
    nom: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadServiceData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchServiceData(params.id)
        setFormData(data)
      } catch (error) {
        console.error("Failed to fetch service data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadServiceData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  /*const handleSelectChange = (value: string) => {
    setFormData({ ...formData, batiment: value })
  }*/

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const response = await fetch(`http://localhost:8080/api/services/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) throw new Error("Failed to update Service");
  
        console.log("Service updated successfully!");
        router.push("/dashboard/service"); // ✅ Redirect to the dashboard
      } catch (error) {
        console.error("Error updating Service:", error);
      }
    }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/service")}
        className="mb-6 -ml-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <h1 className="text-2xl font-semibold mb-8">Modifier le service</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Input
            id="service"
            name="nom"
            required
            value={formData.nom}
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

        {/*<div className="space-y-2">
          <Label htmlFor="batiment">Bâtiment</Label>
          <Select onValueChange={handleSelectChange} value={formData.batiment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un bâtiment" />
            </SelectTrigger>
            <SelectContent>
              {batiments.map((batiment) => (
                <SelectItem key={batiment} value={batiment}>
                  {batiment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>*/}

        <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-8">
          Modifier
        </Button>
      </form>
    </div>
  )
}

