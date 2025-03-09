"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

export default function AddService() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
  })
  const [batiments, setBatiments] = useState<any[]>([])

  useEffect(() => {
    fetch("http://localhost:8080/api/batiments")
        .then(response => response.json())
        .then(data => {
          console.log("✅ Fetched Data:", data);
          setBatiments(data);
        })
        .catch(error => console.error("Erreur de chargement :", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  /*const handleSelectChange = (value: string) => {
    setFormData({ ...formData, batiment: value, batimentId: value })
  }*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Form Data Before Fetching:", formData); // ✅ Debugging

    const response = await fetch(`http://localhost:8080/api/services/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nom: formData.nom,
            description: formData.description,
            batiment: { id: 1 },
        }),
    });

    const data = await response.json();
    console.log("✅ Service créé :", data);
    router.push("/dashboard/service");
  };

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

      <h1 className="text-2xl font-semibold mb-8">Ajouter un nouveau service</h1>

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
                <SelectItem key={batiment.id} value={batiment.id.toString()}>
                  {batiment.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> 
        </div>*/}

        <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-8">
          Ajouter
        </Button>
      </form>
    </div>
  )
}

